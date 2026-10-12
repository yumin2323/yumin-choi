"use client";

import { memo, useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { BeforeAfter } from "./before-after";

/* ---------- 모델 그래프 데이터 (작은 residual block) ---------- */

type OpNode = {
  id: number;
  name: string;
  op: string;
  row: number;
  col: number;
  attrs: [string, string][];
};

type OpEdge = { id: number; source: number; target: number; shape: string };

const NODES: OpNode[] = [
  { id: 0, name: "input", op: "Input", row: 0, col: 1, attrs: [["dtype", "float32"]] },
  { id: 1, name: "conv1", op: "Conv", row: 1, col: 1, attrs: [["kernel", "3×3"], ["stride", "1"], ["pads", "1"]] },
  { id: 2, name: "bn1", op: "BatchNorm", row: 2, col: 0, attrs: [["epsilon", "1e-5"], ["momentum", "0.9"]] },
  { id: 3, name: "conv_skip", op: "Conv", row: 2, col: 2, attrs: [["kernel", "1×1"], ["stride", "1"]] },
  { id: 4, name: "relu1", op: "Relu", row: 3, col: 0, attrs: [] },
  { id: 5, name: "conv2", op: "Conv", row: 4, col: 0, attrs: [["kernel", "3×3"], ["stride", "1"], ["pads", "1"]] },
  { id: 6, name: "add", op: "Add", row: 5, col: 1, attrs: [] },
  { id: 7, name: "relu2", op: "Relu", row: 6, col: 1, attrs: [] },
  { id: 8, name: "output", op: "Output", row: 7, col: 1, attrs: [] },
];

const EDGES: OpEdge[] = [
  { id: 0, source: 0, target: 1, shape: "1×3×56×56" },
  { id: 1, source: 1, target: 2, shape: "1×64×56×56" },
  { id: 2, source: 1, target: 3, shape: "1×64×56×56" },
  { id: 3, source: 2, target: 4, shape: "1×64×56×56" },
  { id: 4, source: 4, target: 5, shape: "1×64×56×56" },
  { id: 5, source: 5, target: 6, shape: "1×64×56×56" },
  { id: 6, source: 3, target: 6, shape: "1×64×56×56" },
  { id: 7, source: 6, target: 7, shape: "1×64×56×56" },
  { id: 8, source: 7, target: 8, shape: "1×64×56×56" },
];

const NODE_BY_ID = new Map(NODES.map((n) => [n.id, n]));

/* 레이아웃 상수 (px). 실제 에디터의 dagre 결과를 손으로 고정한 것 */
const NODE_W = 108;
const NODE_H = 30;
const COL_X = [20, 144, 268];
const ROW_Y = 50;
const TOP = 14;
const CANVAS_W = COL_X[2] + NODE_W + 20;
const CANVAS_H = TOP + 7 * ROW_Y + NODE_H + 14;

const pos = (n: OpNode) => ({ x: COL_X[n.col], y: TOP + n.row * ROW_Y });

type RenderKind = "node" | "edge";
type RenderedHandler = (kind: RenderKind) => void;

/* ---------- 렌더 횟수 계측 ---------- */

/**
 * 커밋될 때마다 카운트를 올리고 잠깐 강조색으로 깜빡인다.
 * 렌더 결과가 아니라 effect에서 DOM에 직접 쓴다(서버/클라이언트 렌더 횟수가 달라 생기는 하이드레이션 불일치 방지).
 * 개발 모드 StrictMode에서는 첫 값이 2로 보일 수 있다.
 */
function useRenderFlash<T extends HTMLElement | SVGElement>(kind: RenderKind, onRendered: RenderedHandler) {
  const el = useRef<T>(null);
  const countEl = useRef<HTMLSpanElement>(null);
  const renders = useRef(0);

  useEffect(() => {
    renders.current += 1;
    onRendered(kind);
    if (countEl.current) countEl.current.textContent = String(renders.current);
    const node = el.current;
    if (!node) return;
    node.dataset.flash = "on";
    const t = setTimeout(() => {
      delete node.dataset.flash;
    }, 300);
    return () => clearTimeout(t);
  });

  return { el, countEl };
}

/* ---------- Node ---------- */

type NodeProps = {
  node: OpNode;
  isSelected: boolean;
  onSelect: (node: OpNode) => void;
  onRendered: RenderedHandler;
};

function NodeView({ node, isSelected, onSelect, onRendered }: NodeProps) {
  const { el, countEl } = useRenderFlash<HTMLDivElement>("node", onRendered);
  // 실제 에디터와 같이 배지 표시는 노드 로컬 상태. 호버한 노드만 다시 렌더된다
  const [showBadge, setShowBadge] = useState(false);
  const { x, y } = pos(node);
  const isConv = node.op === "Conv";
  const isIO = node.op === "Input" || node.op === "Output";

  const onBadgeClick = (e: ReactMouseEvent) => {
    e.stopPropagation();
    onSelect(node);
  };

  return (
    <div
      ref={el}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`${node.name} (${node.op})`}
      onMouseEnter={() => setShowBadge(true)}
      onMouseLeave={() => setShowBadge(false)}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect(node);
      }}
      style={{ left: x, top: y, width: NODE_W, height: NODE_H }}
      className={
        "group absolute flex cursor-pointer items-center gap-1.5 rounded-md border bg-background pr-2 pl-0 text-left select-none transition-[border-color,background-color,box-shadow] duration-500 data-[flash=on]:bg-accent-soft data-[flash=on]:duration-0 " +
        (isSelected
          ? "border-accent shadow-[0_0_0_2px_var(--accent-soft)]"
          : "border-line data-[flash=on]:border-accent")
      }
    >
      <span
        className={
          "h-full w-1.5 shrink-0 rounded-l-[5px] " +
          (isConv ? "bg-accent" : isIO ? "bg-muted" : "bg-line")
        }
      />
      <span className="min-w-0 flex-1 truncate text-[11.5px] font-semibold text-heading">{node.op}</span>
      <span ref={countEl} className="text-[10.5px] font-semibold text-sub tabular-nums">
        0
      </span>
      {(showBadge || isSelected) && (
        <button
          type="button"
          aria-label={`${node.name} 속성 보기`}
          onClick={onBadgeClick}
          className={
            "absolute -top-2.5 -right-2.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border text-[10px] font-semibold shadow-sm " +
            (isSelected
              ? "border-accent bg-accent text-background"
              : "border-line bg-background text-sub hover:border-accent hover:text-accent")
          }
        >
          i
        </button>
      )}
    </div>
  );
}

const MemoNodeView = memo(NodeView);

/** 최적화 전 노드: 선택 객체와 setter를 통째로 받아 안에서 판정한다. memo 없음 */
type NodeWideProps = {
  node: OpNode;
  selectedNode: OpNode | null;
  setSelectedNode: (n: OpNode | null) => void;
  setOpen: (v: boolean) => void;
  onRendered: RenderedHandler;
};

function NodeViewWide({ node, selectedNode, setSelectedNode, setOpen, onRendered }: NodeWideProps) {
  return (
    <NodeView
      node={node}
      isSelected={selectedNode?.id === node.id}
      onSelect={(n) => {
        setSelectedNode(n);
        setOpen(true);
      }}
      onRendered={onRendered}
    />
  );
}

/* ---------- Edge ---------- */

type EdgeProps = {
  edge: OpEdge;
  isSelected: boolean;
  onRendered: RenderedHandler;
};

function EdgeView({ edge, isSelected, onRendered }: EdgeProps) {
  const { el } = useRenderFlash<SVGGElement>("edge", onRendered);
  const from = NODE_BY_ID.get(edge.source)!;
  const to = NODE_BY_ID.get(edge.target)!;
  const a = pos(from);
  const b = pos(to);
  const sx = a.x + NODE_W / 2;
  const sy = a.y + NODE_H;
  const tx = b.x + NODE_W / 2;
  const ty = b.y;
  const midY = (sy + ty) / 2;
  const d = `M ${sx} ${sy} C ${sx} ${midY}, ${tx} ${midY}, ${tx} ${ty - 3}`;
  const lx = (sx + tx) / 2 + (tx >= sx ? 8 : -8);
  const ly = midY - 7;

  return (
    <g ref={el} className="group">
      <path
        d={d}
        fill="none"
        strokeWidth={isSelected ? 1.8 : 1.2}
        markerEnd={isSelected ? "url(#mini-editor-arrow-selected)" : "url(#mini-editor-arrow)"}
        className={
          "transition-[stroke] duration-500 group-data-[flash=on]:stroke-accent group-data-[flash=on]:duration-0 " +
          (isSelected ? "stroke-accent" : "stroke-muted")
        }
      />
      {/* 선택된 노드로 들어가는 엣지에만 텐서 shape 라벨을 보여 준다 */}
      {isSelected && (
        <text
          x={lx}
          y={ly}
          dy="0.35em"
          textAnchor={tx >= sx ? "start" : "end"}
          className="fill-accent text-[9.5px] font-semibold"
          style={{ paintOrder: "stroke", stroke: "var(--background)", strokeWidth: 3 }}
        >
          {edge.shape}
        </text>
      )}
    </g>
  );
}

const MemoEdgeView = memo(EdgeView);

/** 최적화 전 엣지: 선택 배열을 통째로 받아 안에서 find 한다. memo 없음 */
function EdgeViewWide({
  edge,
  selectedData,
  onRendered,
}: {
  edge: OpEdge;
  selectedData: OpNode[];
  onRendered: RenderedHandler;
}) {
  return (
    <EdgeView
      edge={edge}
      isSelected={selectedData.some((d) => d.id === edge.target)}
      onRendered={onRendered}
    />
  );
}

/* ---------- 속성 패널 ---------- */

function PropertyPanel({ node, onClose }: { node: OpNode; onClose: () => void }) {
  const inputs = EDGES.filter((e) => e.target === node.id);
  const outputs = EDGES.filter((e) => e.source === node.id);
  return (
    <aside className="flex w-full flex-col gap-2.5 rounded-lg border border-line bg-soft p-3 text-[12px] sm:w-[190px] sm:shrink-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-heading">{node.name}</div>
          <div className="text-muted">{node.op}</div>
        </div>
        <button
          type="button"
          aria-label="속성 패널 닫기"
          onClick={onClose}
          className="cursor-pointer rounded px-1.5 text-[13px] leading-none text-muted hover:bg-background hover:text-heading"
        >
          ×
        </button>
      </div>
      <Section title="Inputs">
        {inputs.length === 0 ? <Empty /> : inputs.map((e) => <Row key={e.id} k={NODE_BY_ID.get(e.source)!.name} v={e.shape} />)}
      </Section>
      <Section title="Outputs">
        {outputs.length === 0 ? <Empty /> : outputs.map((e) => <Row key={e.id} k={NODE_BY_ID.get(e.target)!.name} v={e.shape} />)}
      </Section>
      <Section title="Attributes">
        {node.attrs.length === 0 ? <Empty /> : node.attrs.map(([k, v]) => <Row key={k} k={k} v={v} />)}
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[10.5px] font-semibold tracking-[0.04em] text-muted uppercase">{title}</div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 font-mono text-[11px]">
      <span className="truncate text-sub">{k}</span>
      <span className="shrink-0 text-heading">{v}</span>
    </div>
  );
}

function Empty() {
  return <span className="text-[11px] text-muted">—</span>;
}

/* ---------- 캔버스(에디터 축소판) ---------- */

function MiniEditor({ optimized }: { optimized: boolean }) {
  const [selectedNode, setSelectedNode] = useState<OpNode | null>(null);
  const [open, setOpen] = useState(false);

  // 이번 커밋에서 렌더된 Node/Edge 수. effect에서 모아 마이크로태스크로 한 번에 DOM에 쓴다
  const tally = useRef({ node: 0, edge: 0 });
  const nodeTallyEl = useRef<HTMLSpanElement>(null);
  const edgeTallyEl = useRef<HTMLSpanElement>(null);
  const flushScheduled = useRef(false);
  const onRendered = useCallback<RenderedHandler>((kind) => {
    tally.current[kind] += 1;
    if (flushScheduled.current) return;
    flushScheduled.current = true;
    queueMicrotask(() => {
      flushScheduled.current = false;
      if (nodeTallyEl.current) nodeTallyEl.current.textContent = String(tally.current.node);
      if (edgeTallyEl.current) edgeTallyEl.current.textContent = String(tally.current.edge);
      tally.current = { node: 0, edge: 0 };
    });
  }, []);

  // 최적화 후: 콜백 참조 고정
  const selectStable = useCallback((n: OpNode) => {
    setSelectedNode(n);
    setOpen(true);
  }, []);

  // 최적화 전: 실제 코드처럼 선택 노드를 배열로 감싸 엣지에 내려줬다. 매 렌더 새 배열
  const selectedData = selectedNode ? [selectedNode] : [];

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-line bg-[radial-gradient(var(--line)_1px,transparent_1px)] bg-[size:14px_14px]">
        <div className="relative mx-auto" style={{ width: CANVAS_W, height: CANVAS_H }}>
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={CANVAS_W}
            height={CANVAS_H}
            aria-hidden="true"
          >
            <defs>
              <marker id="mini-editor-arrow" markerWidth="8" markerHeight="8" viewBox="-4 -4 8 8" orient="auto-start-reverse" refX="0" refY="0">
                <polyline points="-3,-2.5 0,0 -3,2.5" fill="none" strokeWidth="1" className="stroke-muted" />
              </marker>
              <marker id="mini-editor-arrow-selected" markerWidth="8" markerHeight="8" viewBox="-4 -4 8 8" orient="auto-start-reverse" refX="0" refY="0">
                <polyline points="-3,-2.5 0,0 -3,2.5" fill="none" strokeWidth="1.4" className="stroke-accent" />
              </marker>
            </defs>
            {EDGES.map((edge) =>
              optimized ? (
                <MemoEdgeView
                  key={edge.id}
                  edge={edge}
                  isSelected={selectedNode?.id === edge.target}
                  onRendered={onRendered}
                />
              ) : (
                <EdgeViewWide key={edge.id} edge={edge} selectedData={selectedData} onRendered={onRendered} />
              ),
            )}
          </svg>
          {NODES.map((node) =>
            optimized ? (
              <MemoNodeView
                key={node.id}
                node={node}
                isSelected={selectedNode?.id === node.id}
                onSelect={selectStable}
                onRendered={onRendered}
              />
            ) : (
              <NodeViewWide
                key={node.id}
                node={node}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                setOpen={setOpen}
                onRendered={onRendered}
              />
            ),
          )}
        </div>
        <div className="border-t border-line bg-background px-3 py-1.5 text-[12px] text-muted">
          마지막 렌더에서 다시 그려진 것: Node{" "}
          <span ref={nodeTallyEl} className="font-semibold text-heading tabular-nums">
            0
          </span>
          /{NODES.length} · Edge{" "}
          <span ref={edgeTallyEl} className="font-semibold text-heading tabular-nums">
            0
          </span>
          /{EDGES.length}
        </div>
      </div>
      {open && selectedNode && <PropertyPanel node={selectedNode} onClose={() => setOpen(false)} />}
    </div>
  );
}

/**
 * 모델 에디터 축소판. 노드를 클릭해 선택하면 어떤 Node/Edge가 다시 렌더되는지 보여 준다.
 * MDX에서 <MiniEditorDemo />로 사용.
 */
export function MiniEditorDemo() {
  return (
    <BeforeAfter
      title="노드 하나를 선택하면 몇 개가 다시 그려질까"
      beforeNote="캔버스가 selectedNode 객체와 setter를 모든 Node에, 선택 배열을 모든 Edge에 그대로 내려준다. 선택이 바뀌면 Node 9개와 Edge 9개가 전부 다시 렌더된다."
      afterNote="캔버스가 Node/Edge마다 isSelected boolean만 계산해 내려주고, 둘을 memo로 감싸고 콜백은 useCallback으로 고정했다. 이전·새 선택 노드와 새 선택 노드로 들어가는 엣지만 다시 렌더된다."
      hint="노드를 클릭하거나 호버 시 나오는 i 배지를 눌러 선택을 옮겨 보세요. 노드 오른쪽 숫자는 렌더 횟수, 강조색 깜빡임은 방금 렌더됐다는 뜻입니다."
    >
      {(optimized) => <MiniEditor optimized={optimized} />}
    </BeforeAfter>
  );
}
