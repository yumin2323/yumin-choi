"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * 디자인 시스템 패키지의 CSS 배포 방식을 단계별로 바꿔 가며, 같은 패키지 Card가
 * 두 종류의 앱에서 어떻게 그려지는지 보여 준다.
 * - 리셋 앱: Tailwind 없이 전역 리셋(`* { padding: 0 }`)을 레이어 밖에 둔 앱
 * - Tailwind 앱: 사이드바가 `hidden lg:block`인 앱 (넓은 화면 기준)
 * 결과는 단계마다 실제 cascade layer와 specificity로 계산된다. 셀렉터는 `.cdd-`
 * 접두어로 데모 안에만 걸리고, 레이어 이름은 문서 전역이라 단계 번호를 붙인다.
 */

type Outcome = { ok: boolean; text: string };

type Stage = {
  label: string;
  /** 앱이 전역 CSS에 적어야 하는 것 (화면 표시용) */
  appCss: string;
  note: string;
  /** null이면 Tailwind 없는 앱은 지원하지 않는 단계 */
  resetApp: Outcome | null;
  tailwindApp: Outcome[];
  output: string;
  /** 패키지 Card가 접두사 붙은 클래스를 쓰는지 */
  prefixed: boolean;
  /** 단계별 실제 적용 CSS. n은 레이어 이름용 단계 번호 */
  css: (n: number) => string;
};

// 앱이 만든 유틸리티 — 넓은 화면이라 lg:block이 hidden보다 뒤에서 이김
const appUtilities = (n: number, extra = "") => `@layer cdd${n}-utilities {
  .cdd-b .cdd-hidden { display: none; }
  .cdd-b .cdd-lg-block { display: block; }
  ${extra}
}`;

const PADDING = `.cdd-p-4 { padding: 14px 16px; }`;
const SHADOW = `.cdd-shadow-8 { box-shadow: 0 8px 22px rgb(0 0 0 / 0.16); }`;
const scope = (rules: string, root: string) => rules.replace(/^\./gm, `${root} .`);
const both = (rules: string) => `${scope(rules, ".cdd-a")}\n${scope(rules, ".cdd-b")}`;

// 리셋 앱의 전역 리셋 (create-next-app 템플릿처럼 레이어 밖)
const APP_RESET = `.cdd-a, .cdd-a * { margin: 0; padding: 0; }`;

const STAGES: Stage[] = [
  {
    label: "소스 배포",
    appCss: `@import "tailwindcss";
@import "@scope/ui/tokens.css";
@import "@scope/ui/utilities.css";
@import "tw-animate-css";
@custom-variant dark (&:where(.dark, .dark *));
@source "../node_modules/@scope/ui/src"; /* 경로가 틀림 */`,
    note: "앱의 Tailwind가 패키지 소스를 스캔해 CSS를 만든다. @source 경로가 틀리면 앱 코드에 없는 패키지 전용 클래스(shadow-8)만 조용히 빠진다.",
    resetApp: null,
    tailwindApp: [
      { ok: true, text: "사이드바 보임" },
      { ok: false, text: "Card 그림자 없음" },
    ],
    output: "앱 Tailwind가 한 번 생성",
    prefixed: false,
    css: (n) => `@layer cdd${n}-utilities;\n${appUtilities(n, scope(PADDING, ".cdd-b"))}`,
  },
  {
    label: "@source 자체 등록",
    appCss: `@import "tailwindcss";
@import "@scope/ui/tokens.css";
@import "@scope/ui/utilities.css"; /* @source·dark 포함 */
@import "tw-animate-css";`,
    note: "@source를 패키지 CSS가 직접 적는다. 지시어가 쓰인 파일 기준 경로라 앱 위치와 무관하게 맞는다. 다만 앱이 적어야 하는 줄이 여전히 남았다.",
    resetApp: null,
    tailwindApp: [
      { ok: true, text: "사이드바 보임" },
      { ok: true, text: "Card 그림자 있음" },
    ],
    output: "앱 Tailwind가 한 번 생성",
    prefixed: false,
    css: (n) => `@layer cdd${n}-utilities;\n${appUtilities(n, scope(`${PADDING}\n${SHADOW}`, ".cdd-b"))}`,
  },
  {
    label: "사전 빌드 + 전체 레이어",
    appCss: `/* 없음 — 컴포넌트를 import하면 CSS가 따라온다 */`,
    note: "패키지가 CSS를 미리 만들어 @layer ds로 감쌌다. 레이어 밖 전역 리셋이 레이어 안 여백을 이기고, Tailwind 앱에서는 뒤에 선언된 ds가 앱의 utilities보다 높아진다.",
    resetApp: { ok: false, text: "Card 여백 사라짐" },
    tailwindApp: [
      { ok: false, text: "사이드바 사라짐" },
      { ok: true, text: "Card 그림자 있음" },
    ],
    output: "앱과 패키지가 같은 이름의 규칙을 각자 생성",
    prefixed: false,
    css: (n) => `@layer cdd${n}-utilities, cdd${n}-ds;
${APP_RESET}
${appUtilities(n)}
@layer cdd${n}-ds {
  .cdd-b .cdd-hidden { display: none; }
  ${both(`${PADDING}\n${SHADOW}`)}
}`,
  },
  {
    label: "유틸리티만 레이어 밖",
    appCss: `/* 없음 */`,
    note: "유틸리티를 레이어 밖으로 빼자 클래스 셀렉터가 * 리셋을 이겼다. 대신 패키지의 .hidden이 앱 레이어 안의 lg:block을 화면 폭과 상관없이 이긴다.",
    resetApp: { ok: true, text: "Card 여백 유지" },
    tailwindApp: [
      { ok: false, text: "사이드바 사라짐" },
      { ok: true, text: "Card 그림자 있음" },
    ],
    output: "앱과 패키지가 같은 이름의 규칙을 각자 생성",
    prefixed: false,
    css: (n) => `@layer cdd${n}-utilities;
${APP_RESET}
${appUtilities(n)}
.cdd-b .cdd-hidden { display: none; }
${both(`${PADDING}\n${SHADOW}`)}`,
  },
  {
    label: "접두사 + 같은 이름 레이어",
    appCss: `/* Tailwind 앱은 없음. 리셋 앱은 리셋을 레이어로 감싸야 함 */
@layer base {
  * { margin: 0; padding: 0; }
}`,
    note: "패키지 클래스를 yui:로 바꿔 이름 충돌을 없애고 앱의 utilities보다 낮은 레이어에 넣었다. Tailwind 앱은 맞게 나오지만, 같은 스타일이 .flex와 .yui:flex로 두 번 실린다. 리셋 앱은 위 한 줄을 적지 않으면 여백이 사라진다.",
    resetApp: { ok: false, text: "Card 여백 사라짐 (리셋을 감싸기 전)" },
    tailwindApp: [
      { ok: true, text: "사이드바 보임" },
      { ok: true, text: "Card 그림자 있음" },
    ],
    output: "이름만 다른 규칙이 두 벌 (.flex, .yui:flex)",
    prefixed: true,
    css: (n) => `@layer cdd${n}-components, cdd${n}-utilities;
${APP_RESET}
${appUtilities(n)}
@layer cdd${n}-components {
  ${both(".cdd-yui-p-4 { padding: 14px 16px; }\n.cdd-yui-shadow-8 { box-shadow: 0 8px 22px rgb(0 0 0 / 0.16); }")}
}`,
  },
  {
    label: "앱 Tailwind가 한 번에",
    appCss: `@import "tailwindcss";
@import "@scope/ui/styles.css";`,
    note: "패키지는 빌드된 JS와 Tailwind용 CSS 엔트리만 배포한다. 엔트리의 @source가 패키지 dist를 가리켜, 앱의 Tailwind가 앱과 패키지 클래스를 한 번에 만든다. Tailwind 없는 앱은 지원하지 않는다.",
    resetApp: null,
    tailwindApp: [
      { ok: true, text: "사이드바 보임" },
      { ok: true, text: "Card 그림자 있음" },
    ],
    output: "앱 Tailwind가 한 번 생성",
    prefixed: false,
    css: (n) => `@layer cdd${n}-utilities;\n${appUtilities(n, scope(`${PADDING}\n${SHADOW}`, ".cdd-b"))}`,
  },
];

// 레이아웃·색. padding·display·box-shadow는 건드리지 않아 비교 결과와 무관
const LAYOUT = `
.cdd-card { display: grid; gap: 4px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface); }
.cdd-card-title { color: var(--heading); font-size: 13px; font-weight: 600; line-height: 1.4; }
.cdd-card-text { color: var(--sub); font-size: 12.5px; line-height: 1.5; }
.cdd-b { display: flex; gap: 10px; }
.cdd-side { flex: none; width: 84px; padding: 10px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); }
.cdd-side-item { color: var(--sub); font-size: 12px; line-height: 1.9; }
.cdd-side-item[data-active] { color: var(--heading); font-weight: 600; }
.cdd-main { flex: 1; min-width: 0; }
`;

function PackageCard({ prefixed }: { prefixed: boolean }) {
  return (
    <div className={`cdd-card ${prefixed ? "cdd-yui-p-4 cdd-yui-shadow-8" : "cdd-p-4 cdd-shadow-8"}`}>
      <p className="cdd-card-title">패키지 Card</p>
      <p className="cdd-card-text">여백과 그림자는 패키지 클래스</p>
    </div>
  );
}

function Results({ items }: { items: Outcome[] }) {
  return (
    <ul className="m-0 grid list-none gap-0.5 p-0 text-[12.5px]">
      {items.map((item) => (
        <li key={item.text} className={item.ok ? "text-sub" : "font-semibold text-heading"}>
          <span aria-hidden className={item.ok ? "mr-1.5 text-accent" : "mr-1.5"}>
            {item.ok ? "✓" : "✕"}
          </span>
          {item.text}
        </li>
      ))}
    </ul>
  );
}

function Scene({ title, children, results }: { title: string; children: ReactNode; results: Outcome[] }) {
  return (
    <div className="grid content-start gap-2.5 rounded-[10px] bg-soft p-3">
      <p className="text-[12.5px] font-semibold text-sub">{title}</p>
      {children}
      <Results items={results} />
    </div>
  );
}

export function CssDeliveryDemo() {
  const [index, setIndex] = useState(0);
  const groupId = useId();
  const stage = STAGES[index];
  const n = index + 1;

  return (
    <figure className="my-10 border-y border-line py-5">
      <style>{`${stage.css(n)}\n${LAYOUT}`}</style>

      <div className="grid gap-3">
        <figcaption id={groupId} className="text-[15px] font-semibold text-heading">
          CSS를 어떻게 배포하느냐에 따라 달라지는 화면
        </figcaption>
        <div role="radiogroup" aria-labelledby={groupId} className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
          {STAGES.map((s, i) => (
            <button
              key={s.label}
              type="button"
              role="radio"
              aria-checked={index === i}
              onClick={() => setIndex(i)}
              className={
                "cursor-pointer underline-offset-4 transition-colors " +
                (index === i ? "font-semibold text-accent underline decoration-gold" : "text-sub hover:text-heading")
              }
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-sm leading-[1.75] text-sub">{stage.note}</p>

      <div className="mt-5 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Scene title="리셋 앱 (Tailwind 없음)" results={stage.resetApp ? [stage.resetApp] : []}>
            {stage.resetApp ? (
              <div className="cdd-a">
                <PackageCard prefixed={stage.prefixed} />
              </div>
            ) : (
              <p className="rounded-[10px] border border-dashed border-line px-3 py-5 text-center text-[12.5px] text-muted">
                지원하지 않음 (앱에 Tailwind 필요)
              </p>
            )}
          </Scene>

          <Scene title="Tailwind 앱 (넓은 화면)" results={stage.tailwindApp}>
            <div className="cdd-b">
              <nav className="cdd-side cdd-hidden cdd-lg-block" aria-label="데모 사이드바">
                <div className="cdd-side-item" data-active="">
                  Home
                </div>
                <div className="cdd-side-item">Usage</div>
              </nav>
              <div className="cdd-main">
                <PackageCard prefixed={stage.prefixed} />
              </div>
            </div>
          </Scene>
        </div>

        <div className="grid gap-1.5">
          <p className="text-[12.5px] font-semibold text-sub">앱이 전역 CSS에 적는 것</p>
          <pre className="overflow-x-auto rounded-[10px] border border-line bg-background p-3 text-[12px] leading-relaxed text-body">
            <code>{stage.appCss}</code>
          </pre>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-muted">
        <span>
          CSS 생성: <span className="font-semibold text-sub">{stage.output}</span>
        </span>
        <span>번호를 눌러 단계를 바꿔 보세요.</span>
      </div>
    </figure>
  );
}
