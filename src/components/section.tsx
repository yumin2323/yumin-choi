import type { ReactNode } from "react";
import type { Highlight } from "@/lib/resume";

/** 홈 화면의 한 구역. 헤더 메뉴가 id로 이동 */
export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="py-14 sm:py-20">
      <h2 id={`${id}-title`} className="text-[26px] leading-[1.35] font-bold tracking-[-0.03em] text-heading sm:text-[32px]">
        {title}
      </h2>
      {description && <p className="mt-2 text-[17px] text-sub">{description}</p>}
      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}

export function TechChips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item} className="rounded-full bg-accent-soft px-2.5 py-1 text-[13px] leading-none font-semibold text-accent">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** "**굵게**" 표기를 <strong>으로 바꿔서 출력 */
function RichText({ text }: { text: string }) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-heading">{part}</strong> : part));
}

const BULLET = "relative pl-4 before:absolute before:top-[0.72em] before:left-0 before:size-1.5 before:rounded-full";

export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <ul className="space-y-3 text-[15px] leading-[1.7] text-body">
      {items.map((item) => (
        <li key={item.title ?? item.text} className={`${BULLET} before:bg-accent/60`}>
          {item.title && <p className="font-bold text-heading">{item.title}</p>}
          <p className={item.title ? "mt-0.5 text-sub" : undefined}>
            <RichText text={item.text} />
          </p>
          {item.details && (
            <ul className="mt-1.5 space-y-1 text-sub">
              {item.details.map((detail) => (
                <li key={detail} className={`${BULLET} before:bg-line`}>
                  {detail}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}
