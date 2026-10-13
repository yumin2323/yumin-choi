"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { BeforeAfter } from "./before-after";

const COUNT = 230;
/** lg 1920px 프레임 한 장을 디코딩한 크기(원본 코드의 추정치 8.5e6 바이트) */
const FRAME_MB = 8.5;
const PARALLEL = 3;
/** 데모용 가정값: 프레임 한 장 디코딩에 걸리는 시간 */
const DECODE_MS = 12;
const FLING_MS = 2000;
const BUDGETS = [150, 80, 40] as const;

/** 디코딩해 둘 프레임을 급한 순서로: 재생 위치, 첫·마지막 프레임, 그다음 바깥쪽(진행 방향 2장당 반대쪽 1장) */
function wanted(playhead: number, heading: number) {
  const list = [playhead, 0, COUNT - 1];
  for (let d = 1; d < COUNT * 2; d++) {
    list.push(playhead + heading * d);
    if (d % 2 === 0) list.push(playhead - heading * (d / 2));
  }
  return list.filter((i) => i >= 0 && i < COUNT);
}

function keepSet(playhead: number, heading: number, budgetMB: number) {
  const next = new Set<number>();
  for (const i of wanted(playhead, heading)) {
    if (next.has(i)) continue;
    if ((next.size + 1) * FRAME_MB > budgetMB && next.size) break;
    next.add(i);
  }
  return next;
}

/** 가장 가까운 디코딩된 프레임. 디코딩이 스크롤을 못 따라가면 이웃 프레임이 그려진다 */
function nearest(i: number, decoded: Set<number>) {
  for (let d = 0; d < COUNT; d++) {
    if (decoded.has(i - d)) return i - d;
    if (decoded.has(i + d)) return i + d;
  }
  return -1;
}

/** 최적화 후: 재생 위치 주변만 예산 안에서 디코딩한다 */
function useDecodeWindow(playhead: number, budgetMB: number) {
  const decoded = useRef(new Set<number>());
  const inflight = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const keep = useRef(new Set<number>());
  const heading = useRef(1);
  const last = useRef(playhead);
  const [, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);
  // 디코딩 완료 콜백이 예산이 바뀐 뒤에도 최신 schedule을 부르도록
  const scheduleRef = useRef<(head: number) => void>(() => {});

  const schedule = useCallback(
    (head: number) => {
      keep.current = keepSet(head, heading.current, budgetMB);
      for (const i of [...decoded.current]) if (!keep.current.has(i)) decoded.current.delete(i);
      for (const i of keep.current) {
        if (inflight.current.size >= PARALLEL) break;
        if (decoded.current.has(i) || inflight.current.has(i)) continue;
        const t = setTimeout(() => {
          inflight.current.delete(i);
          if (keep.current.has(i)) decoded.current.add(i); // 디코딩 중에 스크롤로 벗어났으면 버린다
          scheduleRef.current(last.current);
        }, DECODE_MS);
        inflight.current.set(i, t);
      }
      bump();
    },
    [budgetMB, bump],
  );

  useEffect(() => {
    scheduleRef.current = schedule;
  }, [schedule]);

  useEffect(() => {
    if (playhead !== last.current) heading.current = playhead > last.current ? 1 : -1;
    last.current = playhead;
    schedule(playhead);
  }, [playhead, schedule]);

  useEffect(() => {
    const timers = inflight.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear(); // StrictMode 재마운트 뒤 슬롯이 막히지 않도록
    };
  }, []);

  return { decoded: decoded.current, inflight: inflight.current };
}

function Strip({
  playhead,
  shown,
  decoded,
  inflight,
}: {
  playhead: number;
  shown: number;
  decoded: Set<number>;
  inflight: Map<number, unknown>;
}) {
  return (
    <div className="flex h-10 w-full gap-px overflow-hidden rounded-md" aria-hidden="true">
      {Array.from({ length: COUNT }, (_, i) => {
        const cls =
          i === shown
            ? "bg-accent"
            : decoded.has(i)
              ? "bg-accent/45"
              : inflight.has(i)
                ? "bg-[var(--gold)]"
                : "bg-line";
        return (
          <span
            key={i}
            className={`min-w-0 flex-1 ${cls} ${i === playhead && i !== shown ? "outline outline-2 outline-[var(--gold)]" : ""}`}
          />
        );
      })}
    </div>
  );
}

function Stat({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-soft px-3 py-2">
      <div className="text-[11.5px] text-muted">{label}</div>
      <div className={`text-[15px] font-semibold tabular-nums ${warn ? "text-[var(--gold)]" : "text-heading"}`}>
        {value}
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    ["bg-accent", "화면에 그린 프레임"],
    ["bg-accent/45", "디코딩해 둔 프레임"],
    ["bg-[var(--gold)]", "디코딩 중"],
    ["bg-line", "압축 상태로만 보관"],
  ];
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-sub">
      {items.map(([cls, label]) => (
        <span key={label} className="inline-flex items-center gap-1.5">
          <span className={`inline-block h-2.5 w-2.5 rounded-sm ${cls}`} />
          {label}
        </span>
      ))}
    </div>
  );
}

/** 빠르게 끝까지 스크롤하는 것처럼 재생 위치를 FLING_MS 동안 반대쪽 끝으로 옮긴다 */
function useFling(setPlayhead: (n: number) => void) {
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (from: number) => {
    cancelAnimationFrame(raf.current);
    const to = from < COUNT / 2 ? COUNT - 1 : 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FLING_MS);
      setPlayhead(Math.round(from + (to - from) * t));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };
}

function Controls({
  playhead,
  setPlayhead,
  fling,
}: {
  playhead: number;
  setPlayhead: (n: number) => void;
  fling: (from: number) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex min-w-[200px] flex-1 items-center gap-2 text-[12.5px] text-sub">
        스크롤
        <input
          type="range"
          min={0}
          max={COUNT - 1}
          value={playhead}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPlayhead(Number(e.target.value))}
          className="flex-1 accent-[var(--accent)]"
        />
      </label>
      <button
        type="button"
        onClick={() => fling(playhead)}
        className="cursor-pointer rounded-md border border-line px-2.5 py-1 text-[12.5px] font-semibold text-sub hover:bg-soft hover:text-heading"
      >
        {playhead < COUNT / 2 ? "끝까지 빠르게 스크롤" : "처음까지 빠르게 스크롤"}
      </button>
    </div>
  );
}

function Before() {
  const [playhead, setPlayhead] = useState(0);
  const fling = useFling(setPlayhead);
  const all = useRef(new Set(Array.from({ length: COUNT }, (_, i) => i))).current;
  return (
    <div className="grid gap-3">
      <Strip playhead={playhead} shown={playhead} decoded={all} inflight={new Map()} />
      <Legend />
      <Controls playhead={playhead} setPlayhead={setPlayhead} fling={fling} />
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="디코딩해 둔 프레임" value={`${COUNT}장`} />
        <Stat label="디코딩 메모리 (추정)" value={`${Math.round(COUNT * FRAME_MB).toLocaleString()}MB`} warn />
        <Stat label="화면 / 요청 프레임" value={`${playhead + 1} / ${playhead + 1}`} />
      </div>
    </div>
  );
}

function After() {
  const [playhead, setPlayhead] = useState(0);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number]>(150);
  const fling = useFling(setPlayhead);
  const { decoded, inflight } = useDecodeWindow(playhead, budget);
  const shown = nearest(playhead, decoded);
  const lagging = shown >= 0 && shown !== playhead;

  return (
    <div className="grid gap-3">
      <Strip playhead={playhead} shown={shown} decoded={decoded} inflight={inflight} />
      <Legend />
      <Controls playhead={playhead} setPlayhead={setPlayhead} fling={fling} />
      <div role="radiogroup" aria-label="메모리 예산" className="flex flex-wrap items-center gap-1.5 text-[12.5px]">
        <span className="mr-1 text-sub">메모리 예산</span>
        {BUDGETS.map((b) => (
          <button
            key={b}
            type="button"
            role="radio"
            aria-checked={budget === b}
            onClick={() => setBudget(b)}
            className={
              "cursor-pointer rounded-md border px-2.5 py-1 font-semibold " +
              (budget === b ? "border-accent bg-accent-soft text-accent" : "border-line text-sub hover:text-heading")
            }
          >
            {b}MB{b === 150 ? " (채택)" : ""}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Stat label="디코딩해 둔 프레임" value={`${decoded.size}장`} />
        <Stat label="디코딩 메모리 (추정)" value={`${Math.round(decoded.size * FRAME_MB)}MB`} />
        <Stat
          label="화면 / 요청 프레임"
          value={shown < 0 ? "–" : `${shown + 1} / ${playhead + 1}${lagging ? " (밀림)" : ""}`}
          warn={lagging}
        />
      </div>
    </div>
  );
}

/**
 * 스크롤 스크럽 페이지의 디코드 윈도우: 재생 위치를 움직이면 디코딩해 둔 프레임 범위가 따라 움직인다.
 * MDX에서 <DecodeWindowDemo />로 사용.
 */
export function DecodeWindowDemo() {
  return (
    <BeforeAfter
      title="프레임 230장 중 몇 장을 디코딩해 둘까"
      beforeNote="받은 프레임 230장을 모두 디코딩된 이미지로 들고 있다. 브라우저는 예산을 넘은 디코딩 결과를 버리고, 그릴 때 다시 디코딩한다."
      afterNote="프레임은 압축 상태로 보관하고, 재생 위치 주변만 예산 안에서 미리 디코딩한다. 진행 방향 쪽을 2배 더 담고, 첫·마지막 프레임은 항상 남긴다."
      hint="슬라이더를 움직이거나 빠르게 스크롤해 보세요. 디코딩 시간(12ms/장, 동시 3장)은 데모용 가정값입니다."
    >
      {(optimized) => (optimized ? <After /> : <Before />)}
    </BeforeAfter>
  );
}
