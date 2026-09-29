import type { Metadata } from "next";
import { PrintLink } from "@/components/print-link";
import { ArrowLink, COLUMNS, Highlights, Num, SHELL, Section, TextLink } from "@/components/section";
import { education, profile, skills, timeline, works } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.nameKo}의 경력과 프로젝트`,
};

export default function ResumePage() {
  return (
    <div className={SHELL}>
      <header className={`pt-16 pb-14 sm:pt-24 sm:pb-16 ${COLUMNS}`}>
        <div aria-hidden="true" />
        <div>
          <h1 className="text-[30px] leading-[1.3] font-semibold tracking-[-0.03em] text-heading sm:text-[36px]">
            {profile.nameKo}
          </h1>
          <p className="mt-1 text-[17px] text-sub">{profile.role}</p>
          <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
            {profile.links.map(({ label, href }) => (
              <TextLink key={href} href={href}>
                {label}
              </TextLink>
            ))}
            <PrintLink />
          </p>
        </div>
      </header>

      <Section id="experience" title="경력">
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
        </ol>
      </Section>

      <Section id="projects" title="프로젝트">
        <ol className="divide-y divide-line">
          {works.map((work, i) => (
            <li key={work.id} id={work.id} className="scroll-mt-[76px] py-12 first:pt-0 last:pb-0">
              <article>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[21px] font-semibold tracking-[-0.025em] text-heading">
                    <span className="mr-2 text-[15px] font-normal">
                      <Num n={i + 1} /> <span className="text-gold">—</span>
                    </span>
                    {work.url ? <TextLink href={work.url}>{work.name}</TextLink> : work.name}
                  </h3>
                  <p className="text-sm text-muted tabular-nums">{work.period}</p>
                </div>
                <p className="mt-1 text-sm text-muted">{work.category}</p>
                <p className="mt-4 text-[15px] leading-[1.8] text-sub">{work.tagline}</p>
                {work.outcome && (
                  <p className="mt-2 text-[15px] leading-[1.8] text-sub">
                    {work.outcome.caption}
                    <span className="ml-2 font-semibold whitespace-nowrap text-heading tabular-nums">
                      {work.outcome.before} → {work.outcome.after}
                    </span>
                  </p>
                )}
                <div className="mt-6">
                  <Highlights items={work.highlights} />
                </div>
                <p className="mt-6 text-[13px] leading-[1.7] text-muted">{work.stack.join(" · ")}</p>
                {work.post && (
                  <p className="mt-4 print:hidden">
                    <ArrowLink href={`/blog/${work.post}`}>관련 글 보기</ArrowLink>
                  </p>
                )}
              </article>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" title="기술">
        <dl className="space-y-2 text-[15px] leading-[1.75]">
          {skills.map((group) => (
            <div key={group.title} className="sm:grid sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-muted">{group.title}</dt>
              <dd className="text-sub">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="education" title="학력과 자격">
        <ul className="space-y-1 text-[15px] leading-[1.75] text-sub">
          {education.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/** 경력 세로선 위의 점. 지금 다니는 곳만 강조 */
function TreeDot({ current }: { current?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute top-[7px] -left-[29px] size-[9px] rounded-full border-2 border-background ${current ? "bg-accent" : "bg-line"}`}
    />
  );
}
