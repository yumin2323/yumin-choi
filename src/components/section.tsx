import type { ReactNode } from "react";
import type { Highlight } from "@/lib/resume";

/** 모든 구역이 공유하는 2단 격자. 왼쪽은 구역 이름, 오른쪽은 본문 */
export const COLUMNS = "md:grid md:grid-cols-[140px_minmax(0,1fr)] md:gap-10";

/** 홈 화면의 한 구역. 헤더 메뉴가 id로 이동 */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-14 sm:py-20 ${COLUMNS}`}>
      <h2 id={`${id}-title`} className="mb-8 text-[15px] leading-[1.9] font-semibold text-heading md:mb-0">
        {title}
      </h2>
      <div>{children}</div>
    </section>
  );
}

/** 본문 속 밑줄 링크. 외부 주소면 새 창으로 */
export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      className="text-heading underline decoration-line decoration-1 underline-offset-[5px] transition-colors hover:decoration-accent"
    >
      {children}
    </a>
  );
}

/** "**굵게**" 표기를 <strong>으로 바꿔서 출력 */
function RichText({ text }: { text: string }) {
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
