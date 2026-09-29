import type { ReactNode } from "react";
import type { Highlight } from "@/lib/resume";

/** 홈 화면의 한 구역. 헤더 메뉴가 id로 이동 */
export function Section({
  id,
  label,
  title,
  description,
  children,
}: {
  id: string;
  /** 제목 위의 작은 영문 레이블 */
  label: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-16 sm:py-24">
      <p className="eyebrow">{label}</p>
      <h2 id={`${id}-title`} className="mt-3 text-[30px] leading-[1.3] font-bold tracking-[-0.035em] text-heading sm:text-[40px]">
        {title}
      </h2>
      {description && <p className="mt-3 max-w-[36em] text-base leading-[1.7] text-sub">{description}</p>}
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  );
}

const BUTTON = {
  solid: "bg-accent text-background hover:bg-accent-hover",
  outline: "border border-line text-heading hover:border-accent hover:text-accent",
};

export function Button({
  href,
  variant = "solid",
  external,
  children,
}: {
  href: string;
  variant?: keyof typeof BUTTON;
  external?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noreferrer" })}
      className={`inline-flex h-11 items-center rounded-lg px-5 text-[15px] font-semibold transition-colors ${BUTTON[variant]}`}
    >
      {children}
    </a>
  );
}

/** "**굵게**" 표기를 <strong>으로 바꿔서 출력 */
function RichText({ text }: { text: string }) {
  return text.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} className="font-bold text-heading">{part}</strong> : part));
}

const BULLET = "relative pl-4 before:absolute before:top-[0.72em] before:left-0 before:size-1.5 before:rounded-full";

export function Highlights({ items }: { items: Highlight[] }) {
  return (
    <ul className="space-y-4 text-[15px] leading-[1.7] text-body">
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
