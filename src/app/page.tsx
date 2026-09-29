import { Hero } from "@/components/hero";
import { Highlights, Section, TextLink } from "@/components/section";
import { education, skills, stories, timeline, works, type Work } from "@/lib/resume";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[760px]">
      <Hero />

      <Section id="works" title="작업">
        <ul className="space-y-14">
          {works.map((work) => (
            <li key={work.name}>
              <WorkItem work={work} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="stories" title="이야기">
        <ul className="space-y-14">
          {stories.map((story) => (
            <li key={story.title}>
              <p className="text-sm text-muted">{story.project}</p>
              <h3 className="mt-1 text-[18px] leading-[1.5] font-semibold tracking-[-0.02em] text-balance text-heading">
                {story.title}
              </h3>
              <dl className="mt-4 space-y-2.5 text-[15px] leading-[1.8]">
                {(
                  [
                    ["문제", story.problem],
                    ["해결", story.approach],
                    ["결과", story.result],
                  ] as const
                ).map(([label, text]) => (
                  <div key={label} className="grid grid-cols-[40px_minmax(0,1fr)] gap-2">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-sub">{text}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="journey" title="걸어온 길">
        <ol className="space-y-8 border-l border-line pl-6">
          {timeline.map((item) => (
            <li key={item.company} className="relative">
              <TreeDot current={item.current} />
              <p className="text-sm text-muted tabular-nums">{item.period}</p>
              <h3 className="mt-0.5 flex items-baseline gap-2 text-[17px] font-semibold tracking-[-0.02em] text-heading">
                {item.company}
                {item.current && <span className="text-[13px] font-normal tracking-normal text-accent">재직 중</span>}
              </h3>
              <p className="mt-1 text-[15px] leading-[1.75] text-sub">{item.summary}</p>
            </li>
          ))}
          <li className="relative">
            <TreeDot />
            <h3 className="text-[15px] font-semibold text-heading">그 전에는</h3>
            <ul className="mt-1 text-[15px] leading-[1.75] text-sub">
              {education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        </ol>

        <h3 className="mt-16 text-[15px] font-semibold text-heading">손에 익은 도구</h3>
        <dl className="mt-4 space-y-2 text-[15px] leading-[1.75]">
          {skills.map((group) => (
            <div key={group.title} className="sm:grid sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-muted">{group.title}</dt>
              <dd className="text-sub">{group.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}

function WorkItem({ work }: { work: Work }) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-heading">
          {work.url ? <TextLink href={work.url}>{work.name}</TextLink> : work.name}
        </h3>
        <p className="text-sm text-muted tabular-nums">{work.period}</p>
      </div>
      <p className="mt-0.5 text-sm text-muted">{work.category}</p>
      <p className="mt-3 text-[15px] leading-[1.8] text-sub">{work.tagline}</p>
      {work.outcome && (
        <p className="mt-2 text-[15px] leading-[1.8] text-sub">
          {work.outcome.caption}
          <span className="ml-2 font-semibold whitespace-nowrap text-heading tabular-nums">
            {work.outcome.before} → {work.outcome.after}
          </span>
        </p>
      )}

      <details className="group mt-3">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm text-accent hover:text-accent-hover [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">자세히 보기</span>
          <span className="hidden group-open:inline">접기</span>
          <svg
            viewBox="0 0 16 16"
            className="size-3.5 transition-transform group-open:rotate-180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className="mt-5 space-y-5">
          <Highlights items={work.highlights} />
          <p className="text-[13px] leading-[1.7] text-muted">{work.stack.join(", ")}</p>
        </div>
      </details>
    </article>
  );
}

/** 걸어온 길 세로선 위의 점. 지금 다니는 곳만 강조 */
function TreeDot({ current }: { current?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-[7px] -left-[29px] size-[9px] rounded-full border-2 border-background ${current ? "bg-accent" : "bg-line"}`}
    />
  );
}
