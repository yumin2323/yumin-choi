import type { ReactNode, SVGProps } from "react";

// 블로그 글 썸네일. 글마다 내용을 상징하는 단순한 도형 그림을 인라인 SVG로 그린다.
// 규칙은 docs/blog-thumbnail-guide.md. 아래 토큰만 써서 그리고, 숫자를 새로 만들지 않는다.

const W = 1200;
const H = 630;

/** 색. globals.css의 --thumb-* 변수라 라이트/다크 테마를 따라간다 */
const C = {
  bg: "var(--thumb-bg)",
  surface: "var(--thumb-surface)",
  line: "var(--thumb-line)",
  muted: "var(--thumb-muted)",
  accent: "var(--accent)",
  accentSoft: "var(--thumb-accent-soft)",
  strong: "var(--heading)",
  gold: "var(--gold)",
};

/** 선 두께. 평범한 선·테두리·연결선은 base, 강조된 선·테두리·흐름은 strong */
const STROKE = { base: 2, strong: 3 };

/** 모서리. 큰 패널·칸은 panel, 노드·카드·입력 칸은 node. 막대는 높이의 절반(알약) */
const RADIUS = { panel: 16, node: 10 };

/** 스켈레톤·데이터 막대 높이 */
const BAR = 14;

/** 점 반지름 */
const DOT = { base: 7, strong: 9 };

/** 그림이 들어가는 안전 영역. 좌우 11%, 상하 13%. 그림은 이 상자의 가로나 세로를 꽉 채운다 */
const SAFE = { left: 132, right: 1068, top: 82, bottom: 548 };
const CENTER = { x: W / 2, y: H / 2 };

/** 흐름을 나타내는 점선 연결선 */
const flow: SVGProps<SVGPathElement> = {
  fill: "none",
  stroke: C.accent,
  strokeWidth: STROKE.strong,
  strokeDasharray: "2 10",
  strokeLinecap: "round",
};

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
      <rect width={W} height={H} fill={C.bg} />
      {thumbnail.draw()}
    </svg>
  );
}

/** 결과 지점을 표시하는 골드 점. 썸네일마다 하나, 강조 흐름이 끝나는 곳에만 */
function GoldDot({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={DOT.strong} fill={C.gold} stroke={C.bg} strokeWidth={STROKE.strong} />;
}

/** 노드·카드·입력 칸. hot이면 강조 */
function Box({ x, y, w, h, hot = false, r = RADIUS.node }: { x: number; y: number; w: number; h: number; hot?: boolean; r?: number }) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={r}
      fill={hot ? C.accentSoft : C.surface}
      stroke={hot ? C.accent : C.line}
      strokeWidth={hot ? STROKE.strong : STROKE.base}
    />
  );
}

/** 스켈레톤·데이터 막대 */
function Bar({ x, y, w, fill = C.line }: { x: number; y: number; w: number; fill?: string }) {
  return <rect x={x} y={y - BAR / 2} width={w} height={BAR} rx={BAR / 2} fill={fill} />;
}

/** 모델 그래프: 층마다 노드를 두고 이웃한 층끼리 잇는다. 강조한 경로가 병목을 걷어낸 길 */
function ModelGraph() {
  const [nw, nh] = [112, 44];
  const gap = 140; // 같은 층 노드 사이 세로 간격
  const counts = [2, 3, 4, 3, 2];
  const cols = counts.map((_, c) => SAFE.left + nw / 2 + (c * (SAFE.right - SAFE.left - nw)) / (counts.length - 1));
  const rows = counts.map((n) => Array.from({ length: n }, (_, r) => CENTER.y + (r - (n - 1) / 2) * gap));
  const path = [0, 1, 2, 2, 1]; // 층별로 강조할 노드

  const edges = cols.slice(0, -1).flatMap((x, c) =>
    rows[c].flatMap((y1, r) =>
      rows[c + 1]
        .map((y2, r2) => ({ y2, hot: path[c] === r && path[c + 1] === r2 }))
        .filter(({ y2 }) => Math.abs(y1 - y2) <= gap)
        .map(({ y2, hot }) => ({ x1: x + nw / 2, y1, x2: cols[c + 1] - nw / 2, y2, hot })),
    ),
  );
  const end = { x: cols.at(-1)!, y: rows.at(-1)![path.at(-1)!] };

  return (
    <g>
      {/* 강조 선이 평범한 선 위에 오도록 순서대로 그림 */}
      {[false, true].map((layer) =>
        edges
          .filter(({ hot }) => hot === layer)
          .map(({ hot, ...e }) => (
            <line key={`${e.x1}-${e.y1}-${e.y2}`} {...e} stroke={hot ? C.accent : C.line} strokeWidth={hot ? STROKE.strong : STROKE.base} />
          )),
      )}
      {cols.map((x, c) =>
        rows[c].map((y, r) => <Box key={`${x}-${y}`} x={x - nw / 2} y={y - nh / 2} w={nw} h={nh} hot={path[c] === r} />),
      )}
      <GoldDot x={end.x + nw / 2} y={end.y - nh / 2} />
    </g>
  );
}

/** OpenAPI 폼: 왼쪽 스키마의 필드 줄이 오른쪽 입력 폼의 칸으로 이어진다 */
function SchemaForm() {
  const pw = 380; // 패널 너비
  const schemaX = SAFE.left;
  const formX = SAFE.right - pw;
  const ph = SAFE.bottom - SAFE.top;
  const pad = 40;

  // 스키마 필드 줄: 들여쓰기 단계, 키 길이, 값 길이
  const schema = [
    [0, 120, 0],
    [1, 96, 72],
    [1, 128, 60],
    [1, 84, 88],
    [1, 108, 0],
    [2, 76, 64],
    [2, 96, 52],
  ] as const;
  const rowY = (i: number) => SAFE.top + 56 + i * 62;

  // 폼 칸: 연결되는 스키마 줄과 세로 위치
  const input = { row: 1, y: 150 };
  const slider = { row: 2, y: 240 };
  const select = { row: 3, y: 330 };
  const group = { row: 5, y: 450 };
  const links = [input, slider, select, group];
  const fx = formX + pad;
  const fw = pw - pad * 2;

  return (
    <g>
      <Box x={schemaX} y={SAFE.top} w={pw} h={ph} r={RADIUS.panel} />
      {schema.map(([indent, key, value], i) => {
        const x = schemaX + pad + indent * 32;
        const linked = links.some((link) => link.row === i);
        return (
          <g key={i}>
            <Bar x={x} y={rowY(i)} w={key} fill={linked ? C.accent : C.muted} />
            {value > 0 && <Bar x={x + key + 16} y={rowY(i)} w={value} />}
          </g>
        );
      })}

      {links.map(({ row, y }) => {
        const [x1, y1, x2] = [schemaX + pw, rowY(row), formX];
        const mx = (x1 + x2) / 2;
        return <path key={row} d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y}, ${x2} ${y}`} {...flow} />;
      })}

      <Box x={formX} y={SAFE.top} w={pw} h={ph} r={RADIUS.panel} />
      {/* 텍스트 입력 */}
      <Box x={fx} y={input.y - 26} w={fw} h={52} />
      <Bar x={fx + 20} y={input.y} w={120} />
      {/* 숫자 입력(슬라이더) */}
      <Bar x={fx} y={slider.y} w={fw} />
      <Bar x={fx} y={slider.y} w={180} fill={C.muted} />
      <circle cx={fx + 180} cy={slider.y} r={14} fill={C.surface} stroke={C.muted} strokeWidth={STROKE.base} />
      {/* 선택 상자 */}
      <Box x={fx} y={select.y - 26} w={fw} h={52} />
      <Bar x={fx + 20} y={select.y} w={96} />
      <path
        d={`M ${fx + fw - 34} ${select.y - 5} l 9 9 l 9 -9`}
        fill="none"
        stroke={C.muted}
        strokeWidth={STROKE.base}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 중첩 객체: 들여쓴 묶음 */}
      <Box x={fx} y={group.y - 58} w={fw} h={116} />
      <Bar x={fx + 24} y={group.y - 18} w={fw - 90} />
      <Bar x={fx + 24} y={group.y + 18} w={fw - 150} />

      <GoldDot x={formX + pw} y={SAFE.top} />
    </g>
  );
}

/** SSE: 위쪽 이벤트가 짧은 구간씩 묶이고, 아래 워크플로우에서 바뀐 노드만 다시 그려진다 */
function EventBatch() {
  const ty = 130; // 타임라인 높이
  const batch = { x1: 520, x2: 720 }; // 한 번에 반영되는 묶음
  const events = [170, 205, 240, 305, 345, 555, 590, 620, 650, 685, 790, 825, 900, 940];
  const stale = 1030; // 이전 실행에서 늦게 도착해 버리는 이벤트

  const [cw, ch] = [182, 132];
  const cy = SAFE.bottom - ch;
  const cards = Array.from({ length: 4 }, (_, i) => SAFE.left + cw / 2 + (i * (SAFE.right - SAFE.left - cw)) / 3);
  const updated = 1;
  const mid = (batch.x1 + batch.x2) / 2;

  return (
    <g>
      {/* 이벤트 타임라인 */}
      <line x1={SAFE.left} y1={ty} x2={SAFE.right} y2={ty} stroke={C.line} strokeWidth={STROKE.base} />
      <Box x={batch.x1} y={SAFE.top} w={batch.x2 - batch.x1} h={(ty - SAFE.top) * 2} hot />
      {events.map((x) => {
        const inBatch = x > batch.x1 && x < batch.x2;
        return <circle key={x} cx={x} cy={ty} r={inBatch ? DOT.strong : DOT.base} fill={inBatch ? C.accent : C.muted} />;
      })}
      <circle cx={stale} cy={ty} r={DOT.strong + 3} fill={C.bg} stroke={C.muted} strokeWidth={STROKE.base} strokeDasharray="4 4" />
      <path
        d={`M ${stale - 6} ${ty - 6} l 12 12 M ${stale + 6} ${ty - 6} l -12 12`}
        stroke={C.muted}
        strokeWidth={STROKE.base}
        strokeLinecap="round"
      />

      {/* 묶음 → 바뀐 노드 */}
      <path d={`M ${mid} ${2 * ty - SAFE.top} C ${mid} ${cy - 60}, ${cards[updated]} ${ty + 120}, ${cards[updated]} ${cy}`} {...flow} />

      {/* 워크플로우 노드 */}
      {cards.slice(0, -1).map((x, i) => (
        <line key={x} x1={x + cw / 2} y1={cy + ch / 2} x2={cards[i + 1] - cw / 2} y2={cy + ch / 2} stroke={C.line} strokeWidth={STROKE.base} />
      ))}
      {cards.map((x, i) => {
        const hot = i === updated;
        return (
          <g key={x}>
            <Box x={x - cw / 2} y={cy} w={cw} h={ch} hot={hot} />
            <Bar x={x - cw / 2 + 28} y={cy + 48} w={hot ? 100 : 84} fill={hot ? C.accent : C.line} />
            <Bar x={x - cw / 2 + 28} y={cy + 84} w={hot ? 126 : 112} fill={hot ? C.accent : C.line} />
          </g>
        );
      })}
      <GoldDot x={cards[updated] + cw / 2} y={cy} />
    </g>
  );
}

/** 폰트 서브셋: 세 언어 글자 중 필요한 글자만 받고, 아래 막대가 줄어든 용량을 보여 준다 */
function FontSubset() {
  const [tile, th] = [260, 320]; // 칸 너비, 높이
  const glyphs = [
    { text: "Aa", hot: false },
    { text: "가", hot: true },
    { text: "あ", hot: false },
  ];
  const tx = (i: number) => SAFE.left + (i * (SAFE.right - SAFE.left - tile)) / 2;
  const top = SAFE.top;
  const before = { y: top + th + 78 };
  const after = { y: before.y + 54, w: Math.max(BAR, ((SAFE.right - SAFE.left) * 53) / 2060) };

  return (
    <g>
      {glyphs.map(({ text, hot }, i) => (
        <g key={text}>
          <rect
            x={tx(i)}
            y={top}
            width={tile}
            height={th}
            rx={RADIUS.panel}
            fill={hot ? C.surface : C.bg}
            stroke={hot ? C.accent : C.line}
            strokeWidth={hot ? STROKE.strong : STROKE.base}
            strokeDasharray={hot ? undefined : "10 10"}
          />
          <text
            x={tx(i) + tile / 2}
            y={top + th / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={124}
            fontWeight={600}
            fill={hot ? C.strong : C.muted}
            style={{ fontFamily: "var(--font-sans)" }}
          >
            {text}
          </text>
        </g>
      ))}

      {/* 용량 막대: 전(2.06MB)과 후(53KB). 실제 비율 그대로 */}
      <Bar x={SAFE.left} y={before.y} w={SAFE.right - SAFE.left} />
      <Bar x={SAFE.left} y={after.y} w={after.w} fill={C.accent} />
      <GoldDot x={SAFE.left + after.w + 20} y={after.y} />
    </g>
  );
}
