import { Hero } from "@/components/hero";
import { Highlights, Section, TechChips } from "@/components/section";
import { WorkIllustration } from "@/components/work-illustration";
import { education, profile, skills, stories, timeline, works } from "@/lib/resume";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[960px]">
      <Hero />

      <Section id="works" title="작업" description="최근 몇 년 동안 가장 오래 붙잡고 있던 제품들이에요.">
        <ul className="grid gap-x-6 gap-y-12 md:grid-cols-2">
          {works.map((work) => (
            <li key={work.name}>
              <article>
                <WorkIllustration variant={work.illustration} />
                <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-[21px] leading-[1.4] font-bold tracking-[-0.02em] text-heading">
                    {work.url ? (
                      <a href={work.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                        {work.name} ↗
                      </a>
                    ) : (
                      work.name
                    )}
                  </h3>
                  <span className="text-sm text-muted tabular-nums">{work.period}</span>
                </div>
                <p className="mt-2 text-[15px] leading-[1.7] text-sub">{work.tagline}</p>
                <div className="mt-4">
                  <TechChips items={work.stack} />
                </div>
                <details className="group mt-4">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-accent hover:underline [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">자세히 보기</span>
                    <span className="hidden group-open:inline">접기</span>
                    <svg viewBox="0 0 16 16" className="size-3.5 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <div className="mt-4 rounded-[14px] bg-soft p-5">
                    <Highlights items={work.highlights} />
                  </div>
                </details>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="stories" title="이야기" description="숫자로 남은 문제 해결 몇 가지를 골랐어요.">
        <ol className="space-y-5">
          {stories.map((story) => (
            <li key={story.title} className="grid gap-6 rounded-[20px] border border-line p-6 sm:p-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10">
              <div className="flex flex-col justify-center">
                <p className="text-sm text-muted tabular-nums line-through decoration-muted/60">
                  {story.metric.before}
                  {story.metric.unit}
                </p>
                <p className="text-[40px] leading-[1.15] font-bold tracking-[-0.04em] text-accent tabular-nums">
                  {story.metric.after}
                  <span className="text-[22px]">{story.metric.unit}</span>
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted">{story.project}</p>
                <h3 className="mt-1 text-[21px] leading-[1.4] font-bold tracking-[-0.02em] text-balance text-heading">{story.title}</h3>
                <dl className="mt-4 space-y-2.5 text-[15px] leading-[1.75]">
                  {(
                    [
                      ["문제", story.problem],
                      ["해결", story.approach],
                      ["결과", story.result],
                    ] as const
                  ).map(([label, text]) => (
                    <div key={label} className="grid grid-cols-[36px_minmax(0,1fr)] gap-2">
                      <dt className="font-bold text-heading">{label}</dt>
                      <dd className="text-sub">{text}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="journey" title="걸어온 길">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14">
          <ol className="relative space-y-8 border-l-2 border-line pl-7">
            {timeline.map((item) => (
              <li key={item.company} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute top-[7px] -left-[35px] size-3 rounded-full border-2 border-background ${item.current ? "bg-accent" : "bg-line"}`}
                />
                <p className="text-sm text-muted tabular-nums">{item.period}</p>
                <h3 className="mt-0.5 text-[19px] font-bold tracking-[-0.02em] text-heading">{item.company}</h3>
                <p className="mt-1 text-[15px] leading-[1.7] text-sub">{item.summary}</p>
              </li>
            ))}
            <li className="relative">
              <span aria-hidden="true" className="absolute top-[7px] -left-[35px] size-3 rounded-full border-2 border-background bg-line" />
              <h3 className="text-[15px] font-bold text-heading">그 전에는</h3>
              <ul className="mt-1 text-[15px] leading-[1.7] text-sub">
                {education.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </li>
          </ol>

          <div>
            <h3 className="text-[17px] font-bold text-heading">손에 익은 도구</h3>
            <dl className="mt-4 space-y-5">
              {skills.map((group) => (
                <div key={group.title}>
                  <dt className="text-sm font-semibold text-muted">{group.title}</dt>
                  <dd className="mt-2">
                    <TechChips items={group.items} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <section id="contact" aria-labelledby="contact-title" className="mt-6 mb-20 rounded-[24px] bg-tint-violet px-6 py-12 text-center sm:py-16">
        <h2 id="contact-title" className="text-[26px] leading-[1.35] font-bold tracking-[-0.03em] text-balance text-heading sm:text-[32px]">
          같이 이야기 나눠요
        </h2>
        <p className="mt-3 text-[17px] text-sub">함께 일하는 제안이나 궁금한 점이 있다면 편하게 연락 주세요.</p>
        <p className="mt-6 text-[20px] font-bold tracking-[-0.01em] break-all text-heading select-all">{profile.email}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex h-11 items-center rounded-[10px] bg-accent px-5 text-[15px] font-semibold text-background hover:opacity-90"
          >
            메일 보내기
          </a>
          {profile.links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-[10px] border border-line bg-background px-5 text-[15px] font-semibold text-heading hover:border-accent hover:text-accent"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
