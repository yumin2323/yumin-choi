import Link from "next/link";
import type { ReactNode } from "react";
import type { Highlight, Outcome } from "@/lib/resume";

/** 사이트 전체 폭. 긴 문단은 안에서 READING으로 다시 좁힌다 */
export const SHELL = "mx-auto max-w-[960px]";

/** 긴 문단의 읽기 폭 */
export const READING = "max-w-[680px]";

/** 모든 구역이 공유하는 2단 격자. 왼쪽은 구역 이름, 오른쪽은 본문 */
export const COLUMNS = "md:grid md:grid-cols-[140px_minmax(0,1fr)] md:gap-10";

/** 한 구역. 위쪽 얇은 구분선으로 앞 구역과 나눈다 */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`border-t border-line py-14 sm:py-20 ${COLUMNS}`}>
      <h2 id={`${id}-title`} className="mb-8 text-[15px] leading-[1.9] font-semibold text-heading md:mb-0">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

/** 본문 속 밑줄 링크. 외부 주소면 새 창으로, 내부 주소면 클라이언트 이동 */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "text-heading underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-gold";
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} {...(external && { target: "_blank", rel: "noreferrer" })} className={className}>
      {children}
    </a>
  );
}

/** "관련 글 →" 같은 이동 링크. 화살표만 골드, hover 시 골드 밑줄이 그어짐 */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-baseline gap-1.5 text-sm text-body transition-colors hover:text-heading"
    >
      <span className="link-underline">{children}</span>
      <span
        aria-hidden="true"
        className="text-gold transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
      >
        →
      </span>
    </Link>
  );
}

/** 프로젝트의 대표 성과 한 줄. 설명 뒤에 "이전 값 → 개선된 값"을 굵게 붙인다 */
export function OutcomeLine({ outcome }: { outcome: Outcome }) {
  return (
    <p className="text-[15px] leading-[1.8] text-sub">
      {outcome.caption}
      <span className="ml-2 font-semibold whitespace-nowrap text-heading tabular-nums">
        {outcome.before} → {outcome.after}
      </span>
    </p>
  );
}

/** 목록 번호. 골드는 이런 작은 표시에만 쓴다 */
export function Num({ n }: { n: number }) {
  return <span className="text-gold tabular-nums">{String(n).padStart(2, "0")}</span>;
}

/** "**굵게**" 표기를 <strong>으로 바꿔서 출력 */
export function RichText({ text }: { text: string }) {
  return text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-heading">
        {part}
      </strong>
    ) : (
      part
    ),
  );
}

export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <ul className="space-y-4 text-[15px] leading-[1.75]">
      {items.map((item) => (
        <li key={item.title ?? item.text}>
          {item.title && <p className="font-semibold text-heading">{item.title}</p>}
          <p className="text-sub">
            <RichText text={item.text} />
          </p>
          {item.details && (
            <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sub marker:text-line">
              {item.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
