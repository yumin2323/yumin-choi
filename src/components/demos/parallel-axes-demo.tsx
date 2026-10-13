"use client";

import { useId, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

type Metric = { key: string; label: string };
type AxisOption = { log: boolean; reverse: boolean };
type LineMode = "axis" | "linear";
type HitMode = "thin" | "wide";

const METRICS: Metric[] = [
  { key: "batch", label: "batch size" },
  { key: "latency", label: "latency (ms)" },
  { key: "throughput", label: "tokens/s" },
];

// 실험 6개. latency는 10~1000 범위라 선형 축에서는 아래쪽에 몰린다
const ROWS: Record<string, number>[] = [
  { batch: 1, latency: 12, throughput: 40 },
  { batch: 4, latency: 30, throughput: 120 },
  { batch: 8, latency: 85, throughput: 210 },
  { batch: 16, latency: 240, throughput: 290 },
  { batch: 32, latency: 610, throughput: 330 },
  { batch: 64, latency: 980, throughput: 350 },
];

const W = 560;
const H = 260;
const M = { top: 20, right: 44, bottom: 34, left: 44 };
const INNER_W = W - M.left - M.right;
const INNER_H = H - M.top - M.bottom;

type Scale = { map: (v: number) => number; ticks: number[] };

/** 선형 스케일. 눈금은 1·2·5 단위로 대략 5개 */
function linearScale(domain: [number, number]): Scale {
  const [d0, d1] = domain;
  const lo = Math.min(d0, d1);
  const hi = Math.max(d0, d1);
  const raw = (hi - lo) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(Math.round(t * 1e6) / 1e6);
  // d0가 아래(INNER_H), d1이 위(0). reverse면 domain 순서를 뒤집어 넘긴다
  return { map: (v) => INNER_H - ((v - d0) / (d1 - d0)) * INNER_H, ticks };
}

/** log10 스케일. 눈금은 10의 거듭제곱만 */
function logScale(domain: [number, number]): Scale {
  const [d0, d1] = domain.map((v) => Math.log10(v)) as [number, number];
  const lo = Math.ceil(Math.min(d0, d1) - 1e-9);
  const hi = Math.floor(Math.max(d0, d1) + 1e-9);
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i));
  return {
    map: (v) => INNER_H - ((Math.log10(v) - d0) / (d1 - d0)) * INNER_H,
    ticks,
  };
}

/** 지표 하나의 축 스케일. log면 domain을 10의 거듭제곱으로 넓히고, reverse면 domain 순서를 뒤집는다 */
function axisScale(key: string, option: AxisOption): Scale {
  const values = ROWS.map((r) => r[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (option.log) {
    const lo = 10 ** Math.floor(Math.log10(Math.max(min, 1)));
    const hi = 10 ** Math.ceil(Math.log10(max));
    return logScale(option.reverse ? [hi, lo] : [lo, hi]);
  }
  return linearScale(option.reverse ? [max, min] : [min, max]);
}

/** Nivo 0.87이 선 좌표를 계산하는 방식: 데이터 min~max의 선형 스케일 고정. log·reverse를 보지 않는다 */
function nivoLinearY(key: string, v: number) {
  const values = ROWS.map((r) => r[key]);
  return linearScale([Math.min(...values), Math.max(...values)]).map(v);
}

const axisX = (i: number) => (i * INNER_W) / (METRICS.length - 1);

function formatTick(v: number) {
  return v >= 1000 ? `${v / 1000}k` : String(v);
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
      <span id={id} className="text-muted">
        {label}
      </span>
      <div role="radiogroup" aria-labelledby={id} className="flex flex-wrap gap-x-3 gap-y-1">
        {options.map(([v, text]) => (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={
              "cursor-pointer underline-offset-4 transition-colors " +
              (value === v ? "font-semibold text-accent underline decoration-gold" : "text-sub hover:text-heading")
            }
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * 평행좌표 차트 축소판: 지표마다 log·reverse를 켜고 끄고, 선 좌표 계산 방식과 호버 영역을 바꿔 본다.
 * MDX에서 <ParallelAxesDemo />로 사용.
 */
export function ParallelAxesDemo() {
  const [options, setOptions] = useState<Record<string, AxisOption>>({
    batch: { log: false, reverse: false },
    latency: { log: true, reverse: false },
    throughput: { log: false, reverse: false },
  });
  const [lineMode, setLineMode] = useState<LineMode>("axis");
  const [hitMode, setHitMode] = useState<HitMode>("wide");
  const [hover, setHover] = useState<{
    row: number;
    x: number;
    y: number;
  } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const scales = Object.fromEntries(METRICS.map((m) => [m.key, axisScale(m.key, options[m.key])]));

  const toggle = (key: string, field: keyof AxisOption) =>
    setOptions((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: !prev[key][field] },
    }));

  const pathOf = (row: Record<string, number>) =>
    METRICS.map((m, i) => {
      const y = lineMode === "axis" ? scales[m.key].map(row[m.key]) : nivoLinearY(m.key, row[m.key]);
      return `${i === 0 ? "M" : "L"}${axisX(i).toFixed(1)} ${y.toFixed(1)}`;
    }).join(" ");

  const onMove = (row: number) => (e: ReactPointerEvent<SVGPathElement>) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    setHover({ row, x: e.clientX - box.left, y: e.clientY - box.top });
  };

  return (
    <figure className="my-10 border-y border-line py-5">
      <figcaption className="text-[15px] font-semibold text-heading">
        지표마다 log·reverse를 따로 켜는 평행좌표 차트
      </figcaption>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {METRICS.map((m) => (
          <fieldset key={m.key} className="flex items-center gap-2.5 text-sm text-sub">
            <legend className="sr-only">{m.label} 축 설정</legend>
            <span className="font-semibold text-heading">{m.label}</span>
            {(["log", "reverse"] as const).map((field) => (
              <label key={field} className="inline-flex cursor-pointer items-center gap-1">
                <input
                  type="checkbox"
                  checked={options[m.key][field]}
                  onChange={() => toggle(m.key, field)}
                  className="accent-[var(--accent)]"
                />
                {field}
              </label>
            ))}
          </fieldset>
        ))}
      </div>

      <div className="mt-3 grid gap-1.5">
        <Segmented<LineMode>
          label="선 좌표"
          value={lineMode}
          onChange={setLineMode}
          options={[
            ["axis", "축 스케일로 계산"],
            ["linear", "Nivo 방식(선형 고정)"],
          ]}
        />
        <Segmented<HitMode>
          label="호버 영역"
          value={hitMode}
          onChange={setHitMode}
          options={[
            ["thin", "2px 선만"],
            ["wide", "10px 투명 선 겹치기"],
          ]}
        />
      </div>

      <div ref={boxRef} className="relative mt-5" onPointerLeave={() => setHover(null)}>
        {/* 좁은 화면에서는 글자가 너무 작아지지 않게 최소 폭을 두고 차트 영역만 가로 스크롤 */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block h-auto w-full min-w-[460px]"
            role="img"
            aria-label="평행좌표 차트"
          >
            <g transform={`translate(${M.left},${M.top})`}>
              {ROWS.map((row, r) => {
                const d = pathOf(row);
                const active = hover?.row === r;
                return (
                  <g key={r}>
                    <path
                      d={d}
                      fill="none"
                      stroke={active ? "var(--accent)" : "var(--muted)"}
                      strokeOpacity={active ? 1 : 0.55}
                      strokeWidth={2}
                      strokeLinejoin="round"
                      onPointerMove={hitMode === "thin" ? onMove(r) : undefined}
                      onPointerLeave={hitMode === "thin" ? () => setHover(null) : undefined}
                    />
                    {hitMode === "wide" && (
                      <path
                        d={d}
                        fill="none"
                        stroke="var(--accent)"
                        strokeOpacity={0.12}
                        strokeWidth={10}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onPointerMove={onMove(r)}
                        onPointerLeave={() => setHover(null)}
                      />
                    )}
                  </g>
                );
              })}

              {METRICS.map((m, i) => (
                <g key={m.key} transform={`translate(${axisX(i)},0)`} className="pointer-events-none">
                  <line y1={0} y2={INNER_H} stroke="var(--line)" strokeWidth={1.5} />
                  {scales[m.key].ticks.map((t) => {
                    const y = scales[m.key].map(t);
                    return (
                      <g key={t} transform={`translate(0,${y})`}>
                        <line x1={-5} x2={0} stroke="var(--muted)" />
                        <text x={-8} dy="0.32em" textAnchor="end" fontSize={10} fill="var(--muted)">
                          {formatTick(t)}
                        </text>
                      </g>
                    );
                  })}
                  <text y={INNER_H + 22} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--sub)">
                    {m.label}
                  </text>
                </g>
              ))}
            </g>
          </svg>
        </div>

        {hover && (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-line bg-background px-3 py-2 text-[12px]"
            style={{ left: hover.x + 12, top: hover.y + 12 }}
          >
            {METRICS.map((m) => (
              <div key={m.key} className="flex justify-between gap-4">
                <span className="text-sub">{m.label}</span>
                <span className="font-semibold text-heading tabular-nums">{ROWS[hover.row][m.key]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-5 text-[13px] text-muted">
        축마다 log와 reverse를 켜 보세요. 선 좌표를 Nivo 방식으로 바꾸면 선이 눈금과 어긋나고, 호버 영역을 2px로 바꾸면
        툴팁을 띄우기 어려워집니다.
      </p>
    </figure>
  );
}
