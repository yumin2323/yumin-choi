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
  "editor-node-select-full-rerender": {
    label: "사이드바에서 바꾼 설정이 그래프의 노드 하나에만 반영되는 그림",
    draw: SelectedNode,
  },
  "generation-stream-state-pipeline": {
    label: "프레임마다 모인 이벤트가 결과 화면의 한 줄에 한 번만 반영되는 그림",
    draw: FrameBatch,
  },
  "json-schema-type-widget-mismatch": {
    label: "같은 type의 필드 중 확장 키가 있는 필드만 위젯 하나로 이어지는 그림",
    draw: WidgetByExtension,
  },
  "scroll-frames-load-decode-memory": {
    label: "프레임 띠에서 재생 위치 주변만 디코딩되어 메모리 막대가 줄어드는 그림",
    draw: DecodeWindow,
  },
  "design-system-css-delivery": {
    label: "패키지와 앱의 코드가 CSS 한 벌로 모이고 중복된 한 벌은 빠지는 그림",
    draw: SingleStylesheet,
  },
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

/** 비활성 칸: 점선 테두리만 있고 안은 배경색 */
function GhostBox({ x, y, w, h, r = RADIUS.node }: { x: number; y: number; w: number; h: number; r?: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={r} fill={C.bg} stroke={C.muted} strokeWidth={STROKE.base} strokeDasharray="10 10" />
  );
}

/** 노드 선택: 사이드바에서 바꾼 설정 한 줄이 그래프의 노드 하나에만 반영되고, 나머지 노드와 엣지는 그대로 */
function SelectedNode() {
  const [nw, nh] = [120, 52];
  const panel = { x: 828, w: SAFE.right - 828 };
  const graphRight = panel.x - 48;
  const counts = [2, 3, 2];
  const cols = counts.map((_, c) => SAFE.left + nw / 2 + (c * (graphRight - SAFE.left - nw)) / (counts.length - 1));
  const gap = (SAFE.bottom - SAFE.top - nh) / 2;
  const rows = counts.map((n) => Array.from({ length: n }, (_, r) => CENTER.y + (r - (n - 1) / 2) * gap));
  const selected = { c: 1, r: 1 };
  const node = { x: cols[selected.c], y: rows[selected.c][selected.r] };

  const edges = cols.slice(0, -1).flatMap((x, c) =>
    rows[c].flatMap((y1) => rows[c + 1].map((y2) => ({ x1: x + nw / 2, y1, x2: cols[c + 1] - nw / 2, y2 }))),
  );

  // 사이드바 설정 줄: 키 길이, 값 길이. 가운데 줄이 바뀐 설정
  const settings = [
    [72, 64],
    [96, 48],
    [84, 72],
    [64, 56],
    [88, 40],
  ] as const;
  const changed = 2;
  const settingY = (i: number) => node.y + (i - changed) * 70;

  return (
    <g>
      {edges.map((e) => (
        <line key={`${e.x1}-${e.y1}-${e.y2}`} {...e} stroke={C.line} strokeWidth={STROKE.base} />
      ))}
      {cols.map((x, c) =>
        rows[c].map((y, r) => (
          <Box key={`${x}-${y}`} x={x - nw / 2} y={y - nh / 2} w={nw} h={nh} hot={c === selected.c && r === selected.r} />
        )),
      )}

      <Box x={panel.x} y={SAFE.top} w={panel.w} h={SAFE.bottom - SAFE.top} r={RADIUS.panel} />
      {settings.map(([key, value], i) => (
        <g key={i}>
          <Bar x={panel.x + 32} y={settingY(i)} w={key} fill={i === changed ? C.accent : C.muted} />
          <Bar x={panel.x + 32 + key + 16} y={settingY(i)} w={value} />
        </g>
      ))}

      {/* 바뀐 설정 → 선택된 노드 */}
      <path d={`M ${panel.x + 24} ${node.y} L ${node.x + nw / 2 + 12} ${node.y}`} {...flow} />
      <GoldDot x={node.x + nw / 2} y={node.y - nh / 2} />
    </g>
  );
}

/** 스트림: 이벤트가 프레임 칸마다 모이고, 한 프레임의 묶음이 결과 화면의 한 줄에 한 번만 반영된다 */
function FrameBatch() {
  const gapX = 24;
  const fw = (SAFE.right - SAFE.left - gapX * 4) / 5;
  const fh = 120;
  const fx = (i: number) => SAFE.left + i * (fw + gapX);
  const events = [3, 5, 4, 2, 4]; // 프레임마다 들어온 이벤트 수
  const hotFrame = 2;
  const ey = SAFE.top + fh / 2;

  const panel = { x: 300, y: 300, w: 600, h: SAFE.bottom - 300 };
  const lines = [220, 300, 260, 180]; // 노드별 상태 줄
  const hotLine = 1;
  const lineY = (i: number) => panel.y + 56 + i * 48;
  const barX = panel.x + 68;

  return (
    <g>
      {events.map((n, i) => {
        const hot = i === hotFrame;
        return (
          <g key={i}>
            <Box x={fx(i)} y={SAFE.top} w={fw} h={fh} hot={hot} />
            {Array.from({ length: n }, (_, k) => (
              <circle
                key={k}
                cx={fx(i) + ((k + 1) * fw) / (n + 1)}
                cy={ey}
                r={hot ? DOT.strong : DOT.base}
                fill={hot ? C.accent : C.muted}
              />
            ))}
          </g>
        );
      })}

      {/* 프레임 묶음 → 결과 화면의 바뀐 줄 */}
      <path
        d={`M ${fx(hotFrame) + fw / 2} ${SAFE.top + fh} C ${fx(hotFrame) + fw / 2} ${panel.y}, ${barX - 40} ${panel.y}, ${barX - 40} ${lineY(hotLine)}`}
        {...flow}
      />

      <Box x={panel.x} y={panel.y} w={panel.w} h={panel.h} r={RADIUS.panel} />
      {lines.map((w, i) => {
        const hot = i === hotLine;
        return (
          <g key={i}>
            <circle cx={panel.x + 40} cy={lineY(i)} r={hot ? DOT.strong : DOT.base} fill={hot ? C.accent : C.muted} />
            <Bar x={barX} y={lineY(i)} w={w} fill={hot ? C.accent : C.line} />
          </g>
        );
      })}
      <GoldDot x={barX + lines[hotLine] + 20} y={lineY(hotLine)} />
    </g>
  );
}

/** JSON Schema 위젯: type이 같은 필드는 어느 위젯으로 갈지 정해지지 않고, 확장 키가 있는 필드만 위젯 하나로 이어진다 */
function WidgetByExtension() {
  const pw = 380;
  const pad = 40;
  const rows = 6;
  const rowY = (i: number) => SAFE.top + 64 + i * 68;
  const keyW = [96, 120, 84, 108, 72, 100];
  const typeW = 72; // 모든 필드가 같은 type
  const extended = 2; // 확장 키가 있는 필드
  const extX = SAFE.left + pad + keyW[extended] + 16 + typeW + 16;
  const extW = 72;

  const ww = 320;
  const wx = SAFE.right - ww;
  const wh = 120;
  const wy = (i: number) => SAFE.top + i * ((SAFE.bottom - SAFE.top - wh) / 2);
  const chosen = 2; // 선택 상자
  const ambiguous = 4; // type만 있는 필드 하나가 위젯을 못 고르는 모습

  return (
    <g>
      <Box x={SAFE.left} y={SAFE.top} w={pw} h={SAFE.bottom - SAFE.top} r={RADIUS.panel} />
      {Array.from({ length: rows }, (_, i) => (
        <g key={i}>
          <Bar x={SAFE.left + pad} y={rowY(i)} w={keyW[i]} fill={C.muted} />
          <Bar x={SAFE.left + pad + keyW[i] + 16} y={rowY(i)} w={typeW} />
          {i === extended && <Bar x={extX} y={rowY(i)} w={extW} fill={C.accent} />}
        </g>
      ))}

      {/* type만으로는 후보 위젯이 하나로 정해지지 않음 */}
      {[0, 1, 2].map((i) => {
        const [x1, y1, x2, y2] = [SAFE.left + pw, rowY(ambiguous), wx, wy(i) + wh / 2];
        const mx = (x1 + x2) / 2;
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
            fill="none"
            stroke={C.muted}
            strokeWidth={STROKE.base}
            strokeDasharray="10 10"
          />
        );
      })}
      {/* 확장 키 → 정해진 위젯 */}
      {(() => {
        const [x1, y1, x2, y2] = [extX + extW + 16, rowY(extended), wx, wy(chosen) + wh / 2];
        const mx = (SAFE.left + pw + wx) / 2;
        return <path d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} {...flow} />;
      })()}

      {/* 후보 위젯: 텍스트 입력, 슬라이더, 선택 상자 */}
      <GhostBox x={wx} y={wy(0)} w={ww} h={wh} />
      <Bar x={wx + 32} y={wy(0) + wh / 2} w={140} fill={C.muted} />
      <GhostBox x={wx} y={wy(1)} w={ww} h={wh} />
      <Bar x={wx + 32} y={wy(1) + wh / 2} w={ww - 64} fill={C.muted} />
      <circle cx={wx + 150} cy={wy(1) + wh / 2} r={14} fill={C.bg} stroke={C.muted} strokeWidth={STROKE.base} />
      <Box x={wx} y={wy(chosen)} w={ww} h={wh} hot />
      <Bar x={wx + 32} y={wy(chosen) + wh / 2} w={120} fill={C.accent} />
      <path
        d={`M ${wx + ww - 50} ${wy(chosen) + wh / 2 - 5} l 9 9 l 9 -9`}
        fill="none"
        stroke={C.accent}
        strokeWidth={STROKE.strong}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <GoldDot x={wx + ww} y={wy(chosen)} />
    </g>
  );
}

/** 디코드 윈도우: 프레임 띠에서 재생 위치 주변 칸만 디코딩되어(채워진 막대) 있고, 아래 막대가 줄어든 메모리를 보여 준다 */
function DecodeWindow() {
  const count = 8;
  const gapX = 20;
  const fw = (SAFE.right - SAFE.left - gapX * (count - 1)) / count;
  const fh = 300;
  const fx = (i: number) => SAFE.left + i * (fw + gapX);
  const decoded = [3, 4, 5]; // 재생 위치 주변

  // 메모리 막대: 스크롤 후 1692MB → 898MB. 실제 비율 그대로
  const full = SAFE.right - SAFE.left;
  const before = { y: SAFE.top + fh + 98 };
  const after = { y: before.y + 54, w: (full * 898) / 1692 };

  return (
    <g>
      {Array.from({ length: count }, (_, i) =>
        decoded.includes(i) ? (
          <g key={i}>
            <Box x={fx(i)} y={SAFE.top} w={fw} h={fh} />
            {[0, 1].map((k) => (
              <Bar key={k} x={fx(i) + 20} y={SAFE.top + fh - 40 - k * 36} w={fw - 40} fill={C.accent} />
            ))}
          </g>
        ) : (
          <GhostBox key={i} x={fx(i)} y={SAFE.top} w={fw} h={fh} />
        ),
      )}

      <Bar x={SAFE.left} y={before.y} w={full} />
      <Bar x={SAFE.left} y={after.y} w={after.w} fill={C.accent} />
      <GoldDot x={SAFE.left + after.w + 20} y={after.y} />
    </g>
  );
}

/** 디자인 시스템 CSS: 패키지 컴포넌트와 앱 코드가 앱의 Tailwind 한 번으로 CSS 한 벌이 되고, 두 번째 벌은 빠진다 */
function SingleStylesheet() {
  const lw = 320;
  const ph = 218;
  const pkg = { x: SAFE.left, y: SAFE.top };
  const app = { x: SAFE.left, y: SAFE.bottom - ph };
  const comp = 72; // 컴포넌트 블록 한 변
  const compX = (i: number) => pkg.x + 32 + i * (comp + (lw - 64 - comp * 3) / 2);

  const rw = 320;
  const css = { x: SAFE.right - rw, y: SAFE.top, h: 298 };
  const dup = { x: css.x, y: css.y + css.h + 32, h: SAFE.bottom - (css.y + css.h + 32) };
  const cssLines = [200, 152, 232, 120, 176];

  const inY = [css.y + 110, css.y + 190]; // 화살이 들어오는 높이

  return (
    <g>
      {/* 패키지: 컴포넌트 블록 */}
      <Box x={pkg.x} y={pkg.y} w={lw} h={ph} r={RADIUS.panel} />
      {[0, 1, 2].map((i) => (
        <Box key={i} x={compX(i)} y={pkg.y + (ph - comp) / 2} w={comp} h={comp} />
      ))}

      {/* 앱: 코드 줄 */}
      <Box x={app.x} y={app.y} w={lw} h={ph} r={RADIUS.panel} />
      {[180, 120, 220].map((w, i) => (
        <Bar key={i} x={app.x + 32} y={app.y + 64 + i * 45} w={w} fill={i === 0 ? C.muted : C.line} />
      ))}

      {[pkg, app].map(({ y }, i) => {
        const [x1, y1, x2, y2] = [SAFE.left + lw, y + ph / 2, css.x, inY[i]];
        const mx = (x1 + x2) / 2;
        return <path key={i} d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`} {...flow} />;
      })}

      {/* 한 번에 컴파일된 CSS 한 벌 */}
      <Box x={css.x} y={css.y} w={rw} h={css.h} hot r={RADIUS.panel} />
      {cssLines.map((w, i) => (
        <Bar key={i} x={css.x + 32} y={css.y + 62 + i * 44} w={w} fill={i === 0 ? C.accent : C.line} />
      ))}
      <GoldDot x={css.x + rw} y={css.y} />

      {/* 빠진 두 번째 벌 */}
      <GhostBox x={dup.x} y={dup.y} w={rw} h={dup.h} r={RADIUS.panel} />
      {[200, 140].map((w, i) => (
        <Bar key={i} x={dup.x + 32} y={dup.y + 48 + i * 44} w={w} fill={C.muted} />
      ))}
    </g>
  );
}
