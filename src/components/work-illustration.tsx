import type { IllustrationVariant } from "@/lib/resume";
import styles from "./work-illustration.module.css";

// 작업 카드 상단 그림. 색은 테마 변수를 쓰는 CSS 클래스로만 칠한다 (320 × 180 좌표)
const TINT: Record<IllustrationVariant, string> = {
  workflow: "var(--tint-violet)",
  graph: "var(--tint-green)",
  benchmark: "var(--tint-orange)",
  website: "var(--soft)",
};

export function WorkIllustration({ variant }: { variant: IllustrationVariant }) {
  return (
    <div className={styles.frame} style={{ background: TINT[variant] }}>
      <svg viewBox="0 0 320 180" aria-hidden="true">
        {variant === "workflow" && <Workflow />}
        {variant === "graph" && <ModelGraph />}
        {variant === "benchmark" && <Benchmark />}
        {variant === "website" && <Website />}
      </svg>
    </div>
  );
}

/** 프롬프트 → 모델 → 결과 이미지로 이어지는 노드 워크플로우 */
function Workflow() {
  return (
    <>
      <path className={styles.flow} d="M112 62 C140 62 140 90 168 90" />
      <path className={styles.flow} d="M112 122 C140 122 140 90 168 90" />
      <path className={styles.flow} d="M232 90 H246" />
      <rect className={styles.card} x="32" y="42" width="80" height="40" rx="8" />
      <rect className={styles.bar} x="42" y="54" width="44" height="5" rx="2.5" />
      <rect className={styles.barSoft} x="42" y="65" width="60" height="5" rx="2.5" />
      <rect className={styles.card} x="32" y="102" width="80" height="40" rx="8" />
      <rect className={styles.bar} x="42" y="114" width="30" height="5" rx="2.5" />
      <rect className={styles.barSoft} x="42" y="125" width="52" height="5" rx="2.5" />
      <rect className={styles.cardAccent} x="168" y="68" width="64" height="44" rx="8" />
      <circle className={styles.dotAccent} cx="200" cy="90" r="8" />
      <rect className={styles.card} x="246" y="50" width="56" height="80" rx="8" />
      <rect className={styles.tint} x="252" y="56" width="44" height="54" rx="4" />
      <circle className={styles.sun} cx="284" cy="68" r="5" />
      <path className={styles.mountain} d="M252 110 L268 86 L280 100 L288 92 L296 104 V110 Z" />
      <rect className={styles.barSoft} x="252" y="117" width="30" height="5" rx="2.5" />
    </>
  );
}

// 층마다 노드 수 (가운데로 갈수록 많아지는 모델 구조)
const LAYERS = [2, 4, 5, 4, 2];

/** 층층이 연결된 모델 그래프. 한 경로만 강조 */
function ModelGraph() {
  const nodes = LAYERS.map((count, i) =>
    Array.from({ length: count }, (_, j) => ({ x: 48 + i * 56, y: 90 + (j - (count - 1) / 2) * 30 })),
  );
  const path = [0, 1, 2, 2, 1];

  return (
    <>
      {nodes.slice(1).map((layer, i) =>
        layer.map((to, j) =>
          nodes[i].map((from, k) => (
            <line key={`${i}-${j}-${k}`} className={styles.edge} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
          )),
        ),
      )}
      {path.slice(1).map((j, i) => {
        const from = nodes[i][path[i]];
        const to = nodes[i + 1][j];
        return <line key={`p${i}`} className={styles.edgeAccent} x1={from.x} y1={from.y} x2={to.x} y2={to.y} />;
      })}
      {nodes.map((layer, i) =>
        layer.map((node, j) => (
          <rect
            key={`${i}-${j}`}
            className={path[i] === j ? styles.cardAccent : styles.card}
            x={node.x - 14}
            y={node.y - 9}
            width="28"
            height="18"
            rx="5"
          />
        )),
      )}
    </>
  );
}

const BARS = [
  { h: 96, cls: "barAccent" },
  { h: 62, cls: "barGreen" },
  { h: 118, cls: "barAccent" },
  { h: 44, cls: "barOrange" },
  { h: 80, cls: "barGreen" },
] as const;

/** 편집 가능한 표 + 막대 차트 */
function Benchmark() {
  return (
    <>
      <rect className={styles.card} x="24" y="28" width="118" height="124" rx="8" />
      {[0, 1, 2, 3, 4].map((row) => (
        <g key={row}>
          <rect className={row === 0 ? styles.bar : styles.barSoft} x="34" y={42 + row * 22} width="42" height="6" rx="3" />
          <rect className={styles.barSoft} x="86" y={42 + row * 22} width="44" height="6" rx="3" />
        </g>
      ))}
      <rect className={styles.selection} x="81" y="58" width="54" height="36" rx="3" />
      <rect className={styles.card} x="156" y="28" width="140" height="124" rx="8" />
      <line className={styles.axis} x1="172" y1="136" x2="284" y2="136" />
      {BARS.map((bar, i) => (
        <rect key={i} className={styles[bar.cls]} x={180 + i * 21} y={136 - bar.h} width="13" height={bar.h} rx="3" />
      ))}
    </>
  );
}

/** 여러 언어 글자가 서브셋으로 나뉘어 들어오는 웹페이지 */
function Website() {
  return (
    <>
      <rect className={styles.card} x="40" y="22" width="240" height="140" rx="10" />
      <line className={styles.axis} x1="40" y1="44" x2="280" y2="44" />
      <circle className={styles.dotSoft} cx="54" cy="33" r="3.5" />
      <circle className={styles.dotSoft} cx="66" cy="33" r="3.5" />
      <circle className={styles.dotSoft} cx="78" cy="33" r="3.5" />
      <text className={styles.glyph} x="64" y="104">
        Aa
      </text>
      <text className={styles.glyph} x="132" y="104">
        가
      </text>
      <text className={styles.glyphAccent} x="190" y="104">
        あ
      </text>
      <rect className={styles.barSoft} x="64" y="124" width="68" height="6" rx="3" />
      <rect className={styles.barSoft} x="64" y="138" width="120" height="6" rx="3" />
      <rect className={styles.pill} x="210" y="124" width="54" height="20" rx="10" />
    </>
  );
}
