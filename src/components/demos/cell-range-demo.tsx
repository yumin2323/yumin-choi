"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

type Cell = { r: number; c: number };
type Rect = { r0: number; c0: number; r1: number; c1: number };
type Change = { r: number; c: number; prev: string };

const COLUMNS = ["batch", "lr", "warmup", "seed"];
const ROWS = 7;

const INITIAL: string[][] = [
  ["8", "1e-4", "100", "0"],
  ["16", "3e-4", "200", "1"],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
  ["", "", "", ""],
];

const key = (r: number, c: number) => `${r},${c}`;

function rectOf(a: Cell, b: Cell): Rect {
  return { r0: Math.min(a.r, b.r), c0: Math.min(a.c, b.c), r1: Math.max(a.r, b.r), c1: Math.max(a.c, b.c) };
}

function cellsOf(rect: Rect) {
  const out = new Set<string>();
  for (let r = rect.r0; r <= rect.r1; r++) for (let c = rect.c0; c <= rect.c1; c++) out.add(key(r, c));
  return out;
}

/** 선택된 셀들을 감싸는 최소 직사각형 */
function boundsOf(selected: Set<string>): Rect | null {
  if (selected.size === 0) return null;
  const cells = [...selected].map((k) => k.split(",").map(Number));
  return {
    r0: Math.min(...cells.map(([r]) => r)),
    c0: Math.min(...cells.map(([, c]) => c)),
    r1: Math.max(...cells.map(([r]) => r)),
    c1: Math.max(...cells.map(([, c]) => c)),
  };
}

const sizeOf = (rect: Rect) => ({ h: rect.r1 - rect.r0 + 1, w: rect.c1 - rect.c0 + 1 });

/** 글의 붙여넣기 규칙: 대상이 복사 범위보다 크고 배수이면 반복, 배수가 아니면 작은 쪽 크기만 */
function pasteSpan(target: number, copied: number) {
  const multiple = target > copied ? target % copied === 0 : true;
  return { multiple, span: multiple ? Math.max(target, copied) : Math.min(target, copied) };
}

/**
 * 표 셀 범위 선택 축소판: 드래그·Ctrl/⌘+클릭으로 선택하고, 이웃 셀을 보고 테두리를 그린다.
 * 복사·붙여넣기(배수면 반복)·채우기 핸들·되돌리기·Shift+방향키 확장을 직접 해 볼 수 있다.
 * MDX에서 <CellRangeDemo />로 사용.
 */
export function CellRangeDemo() {
  const [data, setData] = useState(INITIAL);
  const [selected, setSelected] = useState<Set<string>>(() => cellsOf(rectOf({ r: 0, c: 0 }, { r: 1, c: 0 })));
  const [anchor, setAnchor] = useState<Cell>({ r: 0, c: 0 });
  const [focus, setFocus] = useState<Cell>({ r: 1, c: 0 });
  const [copied, setCopied] = useState<{ rect: Rect; values: string[][] } | null>(null);
  const [fillPreview, setFillPreview] = useState<Rect | null>(null);
  const [undoStack, setUndoStack] = useState<Change[][]>([]);
  const [message, setMessage] = useState("");

  // 드래그 중 상태. 렌더와 무관하므로 ref
  const drag = useRef<{ mode: "select" | "fill"; base: Set<string>; start: Cell; source: Rect } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const bounds = boundsOf(selected);
  const contiguous = bounds !== null && selected.size === sizeOf(bounds).h * sizeOf(bounds).w;
  const fillCells = fillPreview ? cellsOf(fillPreview) : new Set<string>();

  const cellAt = (x: number, y: number): Cell | null => {
    const el = document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cell]");
    if (!el || !gridRef.current?.contains(el)) return null;
    return { r: Number(el.dataset.r), c: Number(el.dataset.c) };
  };

  const applyChanges = (next: string[][], changes: Change[]) => {
    if (changes.length === 0) return;
    setData(next);
    setUndoStack((prev) => [...prev, changes]);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    // 드래그가 표 밖으로 나가도 글 본문 텍스트가 선택되지 않게 막고, 키보드 입력을 받도록 직접 포커스
    e.preventDefault();
    gridRef.current?.focus({ preventScroll: true });

    // 채우기 핸들에서 시작한 드래그는 선택이 아니라 채우기
    if (target.dataset.handle && bounds) {
      drag.current = { mode: "fill", base: selected, start: { r: bounds.r1, c: bounds.c1 }, source: bounds };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }

    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;
    const toggle = e.metaKey || e.ctrlKey;
    const base = toggle ? new Set(selected) : new Set<string>();
    drag.current = { mode: "select", base, start: cell, source: rectOf(cell, cell) };
    setAnchor(cell);
    setFocus(cell);

    if (toggle && selected.has(key(cell.r, cell.c))) {
      base.delete(key(cell.r, cell.c));
      setSelected(new Set(base));
    } else {
      setSelected(new Set([...base, key(cell.r, cell.c)]));
    }
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const cell = cellAt(e.clientX, e.clientY);
    if (!cell) return;

    if (d.mode === "select") {
      setFocus(cell);
      setSelected(new Set([...d.base, ...cellsOf(rectOf(d.start, cell))]));
      return;
    }

    // 채우기: 원본 범위 아래 또는 오른쪽으로, 더 많이 벗어난 방향 하나만 넓힌다
    const { source } = d;
    const down = cell.r - source.r1;
    const right = cell.c - source.c1;
    if (down <= 0 && right <= 0) setFillPreview(null);
    else if (down >= right) setFillPreview({ r0: source.r1 + 1, c0: source.c0, r1: cell.r, c1: source.c1 });
    else setFillPreview({ r0: source.r0, c0: source.c1 + 1, r1: source.r1, c1: cell.c });
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.mode !== "fill" || !fillPreview) return;

    // 원본 범위를 반복해서 채운다
    const { source } = d;
    const { h, w } = sizeOf(source);
    const next = data.map((row) => [...row]);
    const changes: Change[] = [];
    for (let r = fillPreview.r0; r <= fillPreview.r1; r++) {
      for (let c = fillPreview.c0; c <= fillPreview.c1; c++) {
        changes.push({ r, c, prev: next[r][c] });
        next[r][c] = data[source.r0 + ((r - source.r0) % h)][source.c0 + ((c - source.c0) % w)];
      }
    }
    applyChanges(next, changes);
    const whole: Rect = {
      r0: source.r0,
      c0: source.c0,
      r1: Math.max(source.r1, fillPreview.r1),
      c1: Math.max(source.c1, fillPreview.c1),
    };
    setSelected(cellsOf(whole));
    setFillPreview(null);
    setMessage(`채우기: ${h}×${w} 범위를 ${sizeOf(whole).h}×${sizeOf(whole).w}로 반복`);
  };

  const copy = () => {
    if (!bounds) return;
    const values = data.slice(bounds.r0, bounds.r1 + 1).map((row) => row.slice(bounds.c0, bounds.c1 + 1));
    setCopied({ rect: bounds, values });
    const { h, w } = sizeOf(bounds);
    setMessage(`복사: ${h}×${w}`);
  };

  const paste = () => {
    if (!bounds || !copied) return;
    const target = sizeOf(bounds);
    const source = sizeOf(copied.rect);
    const rows = pasteSpan(target.h, source.h);
    const cols = pasteSpan(target.w, source.w);

    const next = data.map((row) => [...row]);
    const changes: Change[] = [];
    for (let i = 0; i < rows.span && bounds.r0 + i < ROWS; i++) {
      for (let j = 0; j < cols.span && bounds.c0 + j < COLUMNS.length; j++) {
        const r = bounds.r0 + i;
        const c = bounds.c0 + j;
        changes.push({ r, c, prev: next[r][c] });
        next[r][c] = copied.values[i % source.h][j % source.w];
      }
    }
    applyChanges(next, changes);

    const repeated = (target.h > source.h && rows.multiple) || (target.w > source.w && cols.multiple);
    const cut = !rows.multiple || !cols.multiple;
    setMessage(
      `붙여넣기: 복사 ${source.h}×${source.w} → 선택 ${target.h}×${target.w}. ` +
        (cut ? "배수가 아니라 작은 쪽 크기만 붙임" : repeated ? "배수라서 반복해 채움" : "그대로 붙임"),
    );
  };

  const undo = () => {
    const last = undoStack.at(-1);
    if (!last) return;
    const next = data.map((row) => [...row]);
    last.forEach(({ r, c, prev }) => (next[r][c] = prev));
    setData(next);
    setUndoStack((prev) => prev.slice(0, -1));
    setMessage(`되돌리기: 셀 ${last.length}개`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const mod = e.metaKey || e.ctrlKey;
    const k = e.key.toLowerCase();
    if (mod && k === "c") return (e.preventDefault(), copy());
    if (mod && k === "v") return (e.preventDefault(), paste());
    if (mod && k === "z") return (e.preventDefault(), undo());

    const delta: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const move = delta[e.key];
    if (!move) return;
    e.preventDefault();

    const clamp = (cell: Cell): Cell => ({
      r: Math.min(ROWS - 1, Math.max(0, cell.r + move[0])),
      c: Math.min(COLUMNS.length - 1, Math.max(0, cell.c + move[1])),
    });

    // Shift+방향키는 anchor를 두고 반대쪽 끝(focus)만 움직여 범위를 넓히거나 줄인다
    if (e.shiftKey) {
      const nextFocus = clamp(focus);
      setFocus(nextFocus);
      setSelected(cellsOf(rectOf(anchor, nextFocus)));
    } else {
      const nextCell = clamp(focus);
      setAnchor(nextCell);
      setFocus(nextCell);
      setSelected(new Set([key(nextCell.r, nextCell.c)]));
    }
  };

  const reset = () => {
    setData(INITIAL);
    setSelected(cellsOf(rectOf({ r: 0, c: 0 }, { r: 1, c: 0 })));
    setAnchor({ r: 0, c: 0 });
    setFocus({ r: 1, c: 0 });
    setCopied(null);
    setUndoStack([]);
    setMessage("");
  };

  /** 이웃 셀이 선택돼 있지 않은 방향에만 테두리를 그린다 (ag-cell-range-top/right/bottom/left 역할) */
  const borderOf = (r: number, c: number) => {
    const has = (rr: number, cc: number) => selected.has(key(rr, cc));
    const accent = "var(--accent)";
    const shadows = [
      !has(r - 1, c) && `inset 0 2px 0 ${accent}`,
      !has(r, c + 1) && `inset -2px 0 0 ${accent}`,
      !has(r + 1, c) && `inset 0 -2px 0 ${accent}`,
      !has(r, c - 1) && `inset 2px 0 0 ${accent}`,
    ].filter(Boolean);
    return shadows.join(", ") || undefined;
  };

  const status = (() => {
    if (!bounds) return "선택 없음";
    const { h, w } = sizeOf(bounds);
    let text = `선택 ${h}×${w}` + (contiguous ? "" : ` 영역 안 ${selected.size}칸 (떨어진 선택이라 채우기 핸들 없음)`);
    if (copied) {
      const s = sizeOf(copied.rect);
      const rows = pasteSpan(h, s.h);
      const cols = pasteSpan(w, s.w);
      const rule =
        !rows.multiple || !cols.multiple ? "작은 쪽 크기만" : h > s.h || w > s.w ? "반복해서 채움" : "그대로";
      text += ` · 복사 ${s.h}×${s.w} → 붙여넣으면 ${rule}`;
    }
    return text;
  })();

  const buttonClass =
    "cursor-pointer text-sub underline underline-offset-4 decoration-line transition-colors hover:text-heading " +
    "disabled:cursor-default disabled:text-muted disabled:no-underline";

  return (
    <figure className="my-10 border-y border-line py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <figcaption className="text-[15px] font-semibold text-heading">그리드 밖에서 직접 만든 셀 범위 선택</figcaption>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          <button type="button" className={buttonClass} onClick={copy} disabled={!bounds}>
            복사
          </button>
          <button type="button" className={buttonClass} onClick={paste} disabled={!bounds || !copied}>
            붙여넣기
          </button>
          <button type="button" className={buttonClass} onClick={undo} disabled={undoStack.length === 0}>
            되돌리기 {undoStack.length > 0 && `(${undoStack.length})`}
          </button>
        </div>
      </div>

      <p className="mt-3 text-sm leading-[1.75] text-sub" aria-live="polite">
        {status}
        {/* 메시지가 없을 때는 단축키 안내를 두어 줄이 비거나 표가 위아래로 움직이지 않게 */}
        <span className="block text-[13px] text-muted">
          {message || "단축키: Ctrl/⌘+C 복사 · Ctrl/⌘+V 붙여넣기 · Ctrl/⌘+Z 되돌리기"}
        </span>
      </p>

      {/* 표 위의 터치는 스크롤이 아니라 선택이라(touch-none) 가로 스크롤에 기대지 않는다. 최소 폭(약 294px)을 낮춰 휴대폰 본문 폭 안에 들어오게 한다 */}
      <div className="mt-5 overflow-x-auto">
        <div
          ref={gridRef}
          role="grid"
          aria-label="실험 파라미터 표"
          aria-multiselectable="true"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          className="grid touch-none select-none rounded-lg border border-line text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-accent"
          style={{ gridTemplateColumns: `36px repeat(${COLUMNS.length}, minmax(64px, 1fr))` }}
        >
          <div role="row" className="contents">
            <div className="border-b border-line bg-soft" />
            {COLUMNS.map((name) => (
              <div
                key={name}
                role="columnheader"
                className="border-b border-l border-line bg-soft px-2 py-1.5 font-semibold whitespace-nowrap text-sub sm:px-2.5"
              >
                {name}
              </div>
            ))}
          </div>

          {data.map((row, r) => (
            <div key={r} role="row" className="contents">
              <div role="rowheader" className="border-t border-line bg-soft py-1.5 text-center text-[12px] text-muted">
                {r + 1}
              </div>
              {row.map((value, c) => {
                const k = key(r, c);
                const isSelected = selected.has(k);
                const inCopy =
                  copied && r >= copied.rect.r0 && r <= copied.rect.r1 && c >= copied.rect.c0 && c <= copied.rect.c1;
                const showHandle = contiguous && bounds && r === bounds.r1 && c === bounds.c1 && !fillPreview;
                return (
                  <div
                    key={k}
                    role="gridcell"
                    aria-selected={isSelected}
                    data-cell=""
                    data-r={r}
                    data-c={c}
                    className={
                      "relative h-9 border-l border-t border-line px-2 py-1.5 tabular-nums text-heading sm:px-2.5 " +
                      (isSelected ? "bg-accent-soft" : "") +
                      (fillCells.has(k) ? " outline-2 -outline-offset-2 outline-dashed outline-accent" : "") +
                      (inCopy && !fillCells.has(k) ? " outline-1 -outline-offset-4 outline-dashed outline-muted" : "")
                    }
                    style={{ boxShadow: isSelected ? borderOf(r, c) : undefined }}
                  >
                    {value}
                    {showHandle && (
                      <span
                        data-handle="true"
                        aria-label="채우기 핸들"
                        className="absolute -bottom-[5px] -right-[5px] z-10 size-[10px] cursor-crosshair rounded-[2px] border-2 border-background bg-accent"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-muted">
        <span>
          드래그로 범위 선택, Ctrl/⌘+클릭으로 떨어진 셀 추가, Shift+방향키로 넓히기. 오른쪽 아래 핸들을 끌면 채웁니다.
          처음 선택된 2×1을 복사한 뒤 4×1이나 3×1을 선택하고 붙여 보세요.
        </span>
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer text-sub underline underline-offset-4 decoration-line hover:text-heading"
        >
          초기화
        </button>
      </div>
    </figure>
  );
}
