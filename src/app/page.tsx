import { Hero } from "@/components/hero";
import { Highlights, Section } from "@/components/section";
import { education, profile, skills, stories, timeline, works, type Outcome } from "@/lib/resume";

/** 기본으로 보이는 핵심 기술 개수 */
const CORE_STACK = 3;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[960px]">
      <Hero />

      <Section id="works" label="Selected Work" title="작업" description="최근 몇 년간 가장 오래 붙잡고 있던 제품들입니다.">
        <ol className="border-b border-line">
          {works.map((work, index) => (
            <li key={work.name} className="border-t border-line py-10 sm:py-12">
              <article className="group grid gap-x-8 gap-y-6 md:grid-cols-[48px_minmax(0,1fr)_240px]">
                <p className="hidden text-[15px] font-semibold text-gold tabular-nums md:block">{number(index)}</p>
                <div>
                  <p className="eyebrow">
                    {/* 좁은 화면에서는 번호를 레이블 앞에 붙임 */}
                    <span className="mr-2 text-gold tabular-nums md:hidden">{number(index)}</span>
                    {work.category}
                    <span className="mx-2 text-line" aria-hidden="true">
                      /
                    </span>
                    <span className="tracking-normal tabular-nums">{work.period}</span>
                  </p>
                  <h3 className="mt-2.5 text-[26px] leading-[1.3] font-bold tracking-[-0.03em] text-heading sm:text-[30px]">{work.name}</h3>
                  <p className="mt-3 max-w-[32em] text-base leading-[1.7] text-sub">{work.tagline}</p>
                  <p className="mt-4 text-[13px] font-medium text-muted">{work.stack.slice(0, CORE_STACK).join(" · ")}</p>
                  {work.url && (
                    <a
                      href={work.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline mt-5 inline-block text-sm font-semibold text-heading"
                    >
                      View project <span className="text-gold">↗</span>
                    </a>
                  )}
                </div>
                {work.outcome && <OutcomeFigure outcome={work.outcome} />}

                <details className="group/details md:col-span-2 md:col-start-2">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-accent hover:text-accent-hover [&::-webkit-details-marker]:hidden">
                    <span className="group-open/details:hidden">자세히 보기</span>
                    <span className="hidden group-open/details:inline">접기</span>
                    <svg
                      viewBox="0 0 16 16"
                      className="size-3.5 transition-transform group-open/details:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <div className="mt-6 max-w-[44em] border-l border-line pl-5">
                    <Highlights items={work.highlights} />
                    <p className="mt-6 text-[13px] text-muted">
                      <span className="font-semibold text-sub">사용 기술</span>
                      <span className="mx-2 text-line" aria-hidden="true">
                        |
                      </span>
                      {work.stack.join(" · ")}
                    </p>
                  </div>
                </details>
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="stories" label="Notes" title="이야기" description="숫자로 남은 문제 해결 사례를 골랐습니다.">
        <ol className="border-b border-line">
          {stories.map((story) => (
            <li key={story.title} className="grid gap-4 border-t border-line py-10 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
              <p className="eyebrow pt-1.5">{story.project}</p>
              <div>
                <h3 className="text-[22px] leading-[1.4] font-bold tracking-[-0.025em] text-balance text-heading">{story.title}</h3>
                <dl className="mt-5 max-w-[44em] space-y-3 text-[15px] leading-[1.75]">
                  {(
                    [
                      ["문제", story.problem],
                      ["해결", story.approach],
                      ["결과", story.result],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="grid grid-cols-[40px_minmax(0,1fr)] gap-2">
                      <dt className="font-semibold text-heading">{label}</dt>
                      <dd className="text-sub">{text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="journey" label="Experience" title="걸어온 길">
        <ol className="border-b border-line">
          {timeline.map((item) => (
            <li key={item.company} className="grid gap-1 border-t border-line py-7 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
              <p className="pt-1 text-sm text-muted tabular-nums">{item.period}</p>
              <div>
                <h3 className="flex items-baseline gap-2.5 text-[19px] font-bold tracking-[-0.02em] text-heading">
                  {item.company}
                  {item.current && <span className="text-xs font-semibold tracking-[0.14em] text-gold">NOW</span>}
                </h3>
                <p className="mt-1 text-[15px] leading-[1.7] text-sub">{item.summary}</p>
              </div>
            </li>
          ))}
          <li className="grid gap-1 border-t border-line py-7 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
            <p className="pt-1 text-sm text-muted">그 전에는</p>
            <ul className="text-[15px] leading-[1.8] text-sub">
              {education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        </ol>

        <div className="mt-14 grid gap-5 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
          <h3 className="text-sm font-semibold text-heading">손에 익은 도구</h3>
          <dl className="grid gap-x-6 gap-y-2.5 text-sm leading-[1.7] sm:grid-cols-[120px_minmax(0,1fr)]">
            {skills.map((group) => (
              <div key={group.title} className="contents">
                <dt className="text-muted">{group.title}</dt>
                <dd className="mb-2 text-sub sm:mb-0">{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-16 sm:py-24">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title" className="mt-3 text-[30px] leading-[1.3] font-bold tracking-[-0.035em] text-balance text-heading sm:text-[40px]">
          함께 일할 제안을 기다립니다
        </h2>
        <p className="mt-3 text-base leading-[1.7] text-sub">협업 제안이나 궁금한 점이 있다면 편하게 연락 주세요.</p>
        <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <a
            href={`mailto:${profile.email}`}
            className="link-underline text-[24px] font-bold tracking-[-0.02em] break-all text-heading sm:text-[32px]"
          >
            {profile.email}
          </a>
          {profile.links.map(({ label, href }) => (
            <a key={href} href={href} target="_blank" rel="noreferrer" className="link-underline text-base font-semibold text-heading">
              {label} <span className="text-gold">↗</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

const number = (index: number) => String(index + 1).padStart(2, "0");

/** 대표 성과: 이전 값 → 개선된 값 */
function OutcomeFigure({ outcome }: { outcome: Outcome }) {
  return (
    <div className="md:pt-7">
      <p className="text-[17px] text-muted tabular-nums">
        {outcome.before}
        <span className="sr-only">에서</span>
      </p>
      <p className="my-0.5 text-lg leading-none text-gold" aria-hidden="true">
        ↓
      </p>
      <p className="text-[48px] leading-[1.15] font-bold tracking-[-0.045em] text-heading tabular-nums transition-colors group-hover:text-accent">
        {outcome.after}
        <span className="sr-only">로</span>
      </p>
      <p className="mt-2 text-[13px] leading-[1.6] text-sub">{outcome.caption}</p>
    </div>
  );
}
