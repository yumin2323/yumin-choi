import type { ReactNode } from "react";

// 블로그 글 썸네일. 글마다 내용을 상징하는 단순한 도형 그림을 인라인 SVG로 그린다.
// 색은 모두 globals.css의 변수라 라이트/다크 테마를 자동으로 따라간다.
// 배경은 --soft, 평범한 요소는 --background·--line, 글의 핵심은 --accent, 골드는 점 하나만.

const W = 1200;
const H = 630;

const bg = "var(--background)";
const soft = "var(--soft)";
const line = "var(--line)";
const accent = "var(--accent)";
const accentSoft = "var(--accent-soft)";
const gold = "var(--gold)";
const muted = "var(--muted)";

const thumbnails: Record<string, { label: string; draw: () => ReactNode }> = {
  "model-graph-rendering": { label: "여러 층의 노드 그래프에서 한 경로가 강조된 그림", draw: ModelGraph },
  "openapi-dynamic-form": { label: "스키마의 필드가 입력 폼으로 이어지는 그림", draw: SchemaForm },
  "sse-workflow-state": { label: "흩어진 이벤트가 묶여 바뀐 노드 하나에만 반영되는 그림", draw: EventBatch },
  "font-subsetting": { label: "세 언어의 글자 중 필요한 글자만 내려받아 용량이 줄어드는 그림", draw: FontSubset },
};

export function hasThumbnail(slug: string) {
  return slug in thumbnails;
}

export function PostThumbnail({ slug, className = "" }: { slug: string; className?: string }) {
  const thumbnail = thumbnails[slug];
  if (!thumbnail) return null;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={thumbnail.label} className={`block h-auto w-full rounded-[10px] ${className}`}>
      <rect width={W} height={H} fill={soft} />
      {thumbnail.draw()}
    </svg>
  );
}

/** 모델 그래프: 층마다 노드를 두고 이웃한 층끼리 잇는다. path가 병목을 따라간 경로 */
function ModelGraph() {
  const cols = [250, 425, 600, 775, 950];
  const rows = [[270, 360], [195, 285, 375, 465], [150, 240, 330, 420, 510], [195, 285, 375, 465], [270, 360]];
  const path = [0, 1, 2, 2, 1]; // 층별로 강조할 노드의 순서
  const [nw, nh] = [96, 40];

  const edges = cols.slice(0, -1).flatMap((x, c) =>
    rows[c].flatMap((y1, r) =>
      rows[c + 1]
        .filter((y2) => Math.abs(y1 - y2) <= 200)
        .map((y2) => ({ x1: x + nw / 2, y1, x2: cols[c + 1] - nw / 2, y2, hot: path[c] === r && rows[c + 1][path[c + 1]] === y2 })),
    ),
  );
  const nodes = cols.flatMap((x, c) => rows[c].map((y, r) => ({ x, y, hot: path[c] === r })));
  const last = { x: cols.at(-1)!, y: rows.at(-1)![path.at(-1)!] };

  return (
    <g transform="translate(600 330) scale(1.3) translate(-600 -330)">
      {edges.map(({ hot, ...e }, i) => (
        <line key={i} {...e} stroke={hot ? accent : line} strokeWidth={hot ? 3 : 1.5} strokeLinecap="round" />
      ))}
      {nodes.map(({ x, y, hot }) => (
        <rect
          key={`${x}-${y}`}
          x={x - nw / 2}
          y={y - nh / 2}
          width={nw}
          height={nh}
          rx={8}
          fill={hot ? accentSoft : bg}
          stroke={hot ? accent : line}
          strokeWidth={hot ? 2.5 : 1.5}
        />
      ))}
      <circle cx={last.x + nw / 2} cy={last.y - nh / 2} r={8} fill={gold} stroke={soft} strokeWidth={3} />
    </g>
  );
}

/** OpenAPI 폼: 왼쪽 스키마의 필드 줄이 오른쪽 입력 폼의 칸으로 이어진다 */
function SchemaForm() {
  // 스키마 쪽 필드 줄 (들여쓰기, 키 길이, 값 길이)
  const schema = [
    { indent: 0, key: 110, value: 0 },
    { indent: 1, key: 90, value: 70 },
    { indent: 1, key: 120, value: 60 },
    { indent: 1, key: 80, value: 80 },
    { indent: 1, key: 100, value: 0 },
    { indent: 2, key: 70, value: 60 },
    { indent: 2, key: 90, value: 50 },
  ];
  const links = [1, 2, 3, 5]; // 폼으로 이어지는 필드
  const fields = [165, 255, 345, 450];

  return (
    <g>
      {/* 스키마 패널 */}
      <rect x={130} y={110} width={400} height={410} rx={14} fill={bg} stroke={line} strokeWidth={2} />
      {schema.map(({ indent, key, value }, i) => {
        const y = 165 + i * 50;
        const x = 170 + indent * 32;
        const hot = links.includes(i);
        return (
          <g key={i}>
            <rect x={x} y={y - 7} width={key} height={14} rx={7} fill={hot ? accent : muted} opacity={hot ? 1 : 0.55} />
            {value > 0 && <rect x={x + key + 16} y={y - 7} width={value} height={14} rx={7} fill={line} />}
          </g>
        );
      })}

      {/* 스키마 → 폼 연결선 */}
      {links.map((row, i) => {
        const y1 = 165 + row * 50;
        const y2 = fields[i];
        return (
          <path
            key={row}
            d={`M 530 ${y1} C 600 ${y1}, 610 ${y2}, 680 ${y2}`}
            fill="none"
            stroke={accent}
            strokeWidth={2.5}
            strokeDasharray="2 9"
            strokeLinecap="round"
          />
        );
      })}

      {/* 입력 폼 패널 */}
      <rect x={680} y={110} width={390} height={410} rx={14} fill={bg} stroke={line} strokeWidth={2} />
      {/* 텍스트 입력 */}
      <rect x={720} y={fields[0] - 22} width={310} height={44} rx={8} fill={bg} stroke={accent} strokeWidth={2.5} />
      <rect x={740} y={fields[0] - 6} width={120} height={12} rx={6} fill={line} />
      {/* 숫자 입력(슬라이더) */}
      <rect x={720} y={fields[1] - 3} width={310} height={6} rx={3} fill={line} />
      <rect x={720} y={fields[1] - 3} width={190} height={6} rx={3} fill={accent} />
      <circle cx={910} cy={fields[1]} r={13} fill={bg} stroke={accent} strokeWidth={2.5} />
      {/* 선택 상자 */}
      <rect x={720} y={fields[2] - 22} width={310} height={44} rx={8} fill={bg} stroke={line} strokeWidth={2} />
      <rect x={740} y={fields[2] - 6} width={90} height={12} rx={6} fill={line} />
      <path d={`M 995 ${fields[2] - 5} l 9 9 l 9 -9`} fill="none" stroke={muted} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* 중첩 객체: 들여쓴 묶음 */}
      <rect x={720} y={fields[3] - 42} width={310} height={84} rx={8} fill={accentSoft} />
      <rect x={745} y={fields[3] - 24} width={260} height={16} rx={8} fill={bg} />
      <rect x={745} y={fields[3] + 8} width={180} height={16} rx={8} fill={bg} />
      <circle cx={1070} cy={110} r={9} fill={gold} stroke={soft} strokeWidth={3} />
    </g>
  );
}

/** SSE: 위쪽 이벤트가 짧은 구간씩 묶이고, 아래 워크플로우에서 바뀐 노드만 다시 그려진다 */
function EventBatch() {
  // 이벤트 도착 시점. 가운데 묶음이 지금 반영되는 이벤트들
  const events = [180, 215, 250, 310, 345, 470, 505, 540, 575, 610, 720, 755, 790, 880, 915, 1000];
  const batch = [440, 640]; // 강조할 묶음 구간
  const stale = 1000; // 이전 실행에서 늦게 도착한 이벤트
  const nodes = [240, 480, 720, 960];
  const updated = 1; // 다시 그려지는 노드

  return (
    <g transform="translate(600 315) scale(1.1) translate(-600 -335)">
      {/* 이벤트 타임라인 */}
      <line x1={140} y1={190} x2={1060} y2={190} stroke={line} strokeWidth={2} />
      <rect x={batch[0]} y={150} width={batch[1] - batch[0]} height={80} rx={12} fill={accentSoft} stroke={accent} strokeWidth={2} />
      {events.map((x) => {
        const inBatch = x > batch[0] && x < batch[1];
        if (x === stale) {
          return (
            <g key={x}>
              <circle cx={x} cy={190} r={11} fill={soft} stroke={muted} strokeWidth={2} strokeDasharray="4 4" />
              <path d={`M ${x - 7} 183 l 14 14 M ${x + 7} 183 l -14 14`} stroke={muted} strokeWidth={2} strokeLinecap="round" />
            </g>
          );
        }
        return <circle key={x} cx={x} cy={190} r={inBatch ? 9 : 7} fill={inBatch ? accent : muted} opacity={inBatch ? 1 : 0.5} />;
      })}

      {/* 묶음 → 바뀐 노드 */}
      <path
        d={`M ${(batch[0] + batch[1]) / 2} 230 C ${(batch[0] + batch[1]) / 2} 320, ${nodes[updated]} 320, ${nodes[updated]} 390`}
        fill="none"
        stroke={accent}
        strokeWidth={2.5}
        strokeDasharray="2 9"
        strokeLinecap="round"
      />

      {/* 워크플로우 노드 */}
      {nodes.slice(0, -1).map((x, i) => (
        <line key={x} x1={x + 80} y1={440} x2={nodes[i + 1] - 80} y2={440} stroke={line} strokeWidth={2} />
      ))}
      {nodes.map((x, i) => {
        const hot = i === updated;
        return (
          <g key={x}>
            <rect x={x - 80} y={390} width={160} height={100} rx={12} fill={hot ? accentSoft : bg} stroke={hot ? accent : line} strokeWidth={hot ? 2.5 : 2} />
            <rect x={x - 55} y={420} width={hot ? 90 : 70} height={12} rx={6} fill={hot ? accent : line} />
            <rect x={x - 55} y={446} width={hot ? 110 : 100} height={12} rx={6} fill={hot ? accent : line} opacity={hot ? 0.45 : 1} />
          </g>
        );
      })}
      <circle cx={nodes[updated] + 80} cy={390} r={9} fill={gold} stroke={soft} strokeWidth={3} />
    </g>
  );
}

/** 폰트 서브셋: 세 언어 글자 중 필요한 글자만 받고, 아래 막대가 용량 차이를 보여 준다 */
function FontSubset() {
  const glyphs = [
    { x: 250, text: "Aa", hot: false },
    { x: 600, text: "가", hot: true },
    { x: 950, text: "あ", hot: false },
  ];

  return (
    <g transform="translate(0 15)">
      {glyphs.map(({ x, text, hot }) => (
        <g key={text}>
          <rect
            x={x - 130}
            y={100}
            width={260}
            height={240}
            rx={16}
            fill={hot ? bg : soft}
            stroke={hot ? accent : line}
            strokeWidth={hot ? 3 : 2}
            strokeDasharray={hot ? undefined : "10 10"}
          />
          <text
            x={x}
            y={222}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={120}
            fontWeight={600}
            fill={hot ? "var(--heading)" : muted}
            fillOpacity={hot ? 1 : 0.45}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {text}
          </text>
        </g>
      ))}
      <circle cx={730} cy={100} r={9} fill={gold} stroke={soft} strokeWidth={3} />

      {/* 용량 막대: 전(2.06MB)과 후(53KB) */}
      <rect x={120} y={420} width={960} height={22} rx={11} fill={line} />
      <rect x={120} y={480} width={Math.max(24, (960 * 53) / 2060)} height={22} rx={11} fill={accent} />
    </g>
  );
}
