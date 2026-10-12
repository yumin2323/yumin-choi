"use client";

import { useEffect, useRef, useState } from "react";
import { BeforeAfter } from "./before-after";

type Status = "IDLE" | "IN_QUEUE" | "IN_PROGRESS" | "COMPLETED";

const STATUS_RANK: Record<Status, number> = {
  IDLE: 0,
  IN_QUEUE: 1,
  IN_PROGRESS: 1,
  COMPLETED: 2,
};

const STATUS_LABEL: Record<Status, string> = {
  IDLE: "대기",
  IN_QUEUE: "큐",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
};

const NODE_COUNT = 6;
const TICK_MS = 25;
const TICKS = 60;

type NodeState = { status: Status; progress: number };
type StreamEvent = { at: number; nodeId: number; status: Status; progress: number };

const initialNodes = (): NodeState[] =>
  Array.from({ length: NODE_COUNT }, () => ({ status: "IDLE" as Status, progress: 0 }));

/**
 * 실행 스트림을 흉내 낸 이벤트 목록.
 * 노드마다 시작 시점이 조금씩 어긋나 있어서, 한 프레임 안에 여러 노드의
 * 이벤트가 겹쳐 도착한다. 완료 두 틱 뒤에 늦게 도착한 진행 이벤트를 하나 섞어
 * 순서가 뒤바뀐 경우를 만든다.
 */
function buildEvents(): StreamEvent[] {
  const events: StreamEvent[] = [];

  for (let nodeId = 0; nodeId < NODE_COUNT; nodeId += 1) {
    const start = nodeId * 3;
    const end = start + 40;

    for (let tick = start; tick <= end; tick += 1) {
      const progress = Math.round(((tick - start) / (end - start)) * 100);
      // 같은 틱이라도 노드마다 몇 ms씩 어긋나게 도착시킨다
      const at = tick * TICK_MS + nodeId * 3;

      if (tick === start) events.push({ at, nodeId, status: "IN_QUEUE", progress: 0 });
      else if (tick === end) events.push({ at, nodeId, status: "COMPLETED", progress: 100 });
      else events.push({ at, nodeId, status: "IN_PROGRESS", progress });
    }

    // 뒤늦게 도착한 진행 이벤트
    events.push({
      at: (end + 2) * TICK_MS + nodeId * 3,
      nodeId,
      status: "IN_PROGRESS",
      progress: 95,
    });
  }

  return events.sort((a, b) => a.at - b.at);
}

function NodeRow({ node, index }: { node: NodeState; index: number }) {
  const done = node.status === "COMPLETED";
  const running = node.status === "IN_PROGRESS";

  return (
    <li className="flex items-center gap-3">
      <span className="w-12 shrink-0 text-[12px] font-semibold text-sub">노드 {index + 1}</span>

      <span
        className={
          "w-16 shrink-0 rounded-md px-2 py-0.5 text-center text-[11.5px] font-semibold " +
          (done ? "bg-accent-soft text-accent" : running ? "bg-soft text-heading" : "text-muted")
        }
      >
        {STATUS_LABEL[node.status]}
      </span>

      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-soft">
        <span
          className={"block h-full rounded-full " + (done ? "bg-accent" : "bg-sub/40")}
          style={{ width: `${node.progress}%` }}
        />
      </span>
    </li>
  );
}

function Run({ optimized }: { optimized: boolean }) {
  const [nodes, setNodes] = useState<NodeState[]>(initialNodes);

  const commitEl = useRef<HTMLSpanElement>(null);
  const eventEl = useRef<HTMLSpanElement>(null);
  const backwardEl = useRef<HTMLSpanElement>(null);

  const commits = useRef(0);
  const received = useRef(0);
  const backwards = useRef(0);
  // 화면에 반영된 상태의 거울. 역행 판정에만 쓴다.
  const shown = useRef<Status[]>(Array.from({ length: NODE_COUNT }, () => "IDLE" as Status));

  // deps 없음: 이 컴포넌트가 커밋될 때마다 실행 = store 반영 1회
  useEffect(() => {
    commits.current += 1;
    if (commitEl.current) commitEl.current.textContent = String(commits.current);
  });

  useEffect(() => {
    const events = buildEvents();
    shown.current = Array.from({ length: NODE_COUNT }, () => "IDLE" as Status);
    const timers: number[] = [];
    let raf = 0;
    const queue: StreamEvent[] = [];

    const bumpCounters = (ev: StreamEvent) => {
      received.current += 1;
      if (eventEl.current) eventEl.current.textContent = String(received.current);
      return ev;
    };

    // 최적화 전: 이벤트가 도착하는 즉시 store 에 쓴다. 순서 판정도 없다.
    const applyNow = (ev: StreamEvent) => {
      // 역행 판정은 updater 밖에서 한다. setState updater 안에서 ref 를 올리면
      // StrictMode 가 updater 를 두 번 호출하면서 숫자가 두 배로 세어진다.
      if (STATUS_RANK[ev.status] < STATUS_RANK[shown.current[ev.nodeId]]) {
        backwards.current += 1;
        if (backwardEl.current) backwardEl.current.textContent = String(backwards.current);
      }
      shown.current[ev.nodeId] = ev.status;

      setNodes((prev) => {
        const next = prev.slice();
        next[ev.nodeId] = { status: ev.status, progress: ev.progress };
        return next;
      });
    };

    // 최적화 후: 큐에 쌓고 프레임당 한 번만 비운다.
    const flush = () => {
      raf = 0;
      if (queue.length === 0) return;

      const batch = queue.splice(0, queue.length);
      const best = new Map<number, StreamEvent>();

      for (const ev of batch) {
        const cur = best.get(ev.nodeId);
        // 같은 배치 안에서는 더 진행된 쪽을 남긴다
        const better =
          !cur ||
          STATUS_RANK[ev.status] > STATUS_RANK[cur.status] ||
          (STATUS_RANK[ev.status] === STATUS_RANK[cur.status] && ev.progress >= cur.progress);
        if (better) best.set(ev.nodeId, ev);
      }

      setNodes((prev) => {
        const next = prev.slice();
        for (const [nodeId, ev] of best) {
          // 저장된 값보다 뒤처진 이벤트는 버린다
          if (STATUS_RANK[ev.status] < STATUS_RANK[next[nodeId].status]) continue;
          next[nodeId] = { status: ev.status, progress: ev.progress };
        }
        return next;
      });
    };

    const enqueue = (ev: StreamEvent) => {
      queue.push(ev);
      if (!raf) raf = requestAnimationFrame(flush);
    };

    for (const ev of events) {
      // 이벤트마다 별도 태스크로 도착시킨다. 한 태스크에 몰면 React 가
      // 알아서 묶어 버려서 "이벤트당 반영"을 재현할 수 없다.
      const id = window.setTimeout(
        () => (optimized ? enqueue(bumpCounters(ev)) : applyNow(bumpCounters(ev))),
        ev.at,
      );
      timers.push(id);
    }

    return () => {
      timers.forEach(clearTimeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [optimized]);

  return (
    <div>
      <ul className="flex flex-col gap-2.5">
        {nodes.map((node, i) => (
          <NodeRow key={i} node={node} index={i} />
        ))}
      </ul>

      <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-line pt-3 text-[12.5px]">
        <div className="flex gap-2">
          <dt className="text-muted">도착한 이벤트</dt>
          <dd className="font-semibold text-heading tabular-nums">
            <span ref={eventEl}>0</span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">store 반영</dt>
          <dd className="font-semibold text-accent tabular-nums">
            <span ref={commitEl}>0</span>
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">상태 역행</dt>
          <dd className="font-semibold text-heading tabular-nums">
            <span ref={backwardEl}>0</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * 노드 6개가 동시에 진행되는 실행 스트림을 흉내 낸 데모.
 * MDX에서 <StreamBatchDemo />로 사용.
 */
export function StreamBatchDemo() {
  return (
    <BeforeAfter
      title="이벤트가 도착할 때마다 반영하면 몇 번 쓰게 될까"
      beforeNote="이벤트 하나당 store에 한 번 쓴다. 노드 6개가 동시에 진행되므로 한 프레임 안에서 여러 번 쓰게 되고, 늦게 도착한 이벤트가 완료된 노드를 진행 중으로 되돌린다."
      afterNote="이벤트를 큐에 쌓고 프레임당 한 번만 비운다. 같은 배치의 같은 노드는 더 진행된 쪽만 남기고, 저장된 값보다 뒤처진 이벤트는 버린다."
      hint="두 모드의 '도착한 이벤트'는 같습니다. 'store 반영'과 '상태 역행'을 비교해 보세요."
    >
      {(optimized) => <Run optimized={optimized} />}
    </BeforeAfter>
  );
}
