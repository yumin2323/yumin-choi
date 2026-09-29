import { Hero } from "@/components/hero";
import { Highlights, Section, TechChips } from "@/components/section";
import { formatDuration } from "@/lib/date";
import { certificates, companies, education, skills, stats, type Milestone } from "@/lib/resume";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[880px]">
      <Hero />

      <ul aria-label="주요 성과" className="mb-16 grid gap-3 sm:mb-20 sm:grid-cols-3">
        {stats.map((stat) => (
          <li key={stat.label} className="rounded-[18px] bg-soft p-6">
            <p className="text-[28px] leading-[1.2] font-bold tracking-[-0.03em] text-accent tabular-nums">{stat.value}</p>
            <p className="mt-2 text-[15px] font-semibold text-heading">{stat.label}</p>
            <p className="mt-0.5 text-sm text-muted tabular-nums">{stat.detail}</p>
          </li>
        ))}
      </ul>

      <Section id="experience" eyebrow="Experience" title="경력">
        <ol className="space-y-16">
          {companies.map((company) => (
            <li key={company.name} className="grid gap-5 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
              <div className="md:sticky md:top-24 md:self-start">
                <h3 className="text-[22px] leading-[1.4] font-bold tracking-[-0.02em] text-heading">{company.name}</h3>
                <p className="mt-1 text-sm text-muted tabular-nums">
                  {company.start} – {company.end ?? "현재"}
                  {company.end && <span className="ml-1.5">· {formatDuration(company.start, company.end)}</span>}
                </p>
                {!company.end && (
                  <span className="mt-2 inline-block rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">재직 중</span>
                )}
              </div>

              <ul className="space-y-10">
                {company.projects.map((project) => (
                  <li key={project.name} className="border-l-2 border-line pl-5 sm:pl-6">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="text-[19px] leading-[1.45] font-bold tracking-[-0.02em] text-heading">
                        {project.url ? (
                          <a href={project.url} target="_blank" rel="noreferrer" className="hover:text-accent">
                            {project.name} ↗
                          </a>
                        ) : (
                          project.name
                        )}
                      </h4>
                      {project.period && <span className="text-sm text-muted tabular-nums">{project.period}</span>}
                    </div>
                    {project.summary && <p className="mt-1 text-[15px] leading-[1.7] text-sub">{project.summary}</p>}
                    <div className="mt-3">
                      <TechChips items={project.stack} />
                    </div>
                    <div className="mt-5">
                      <Highlights items={project.highlights} />
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="skills" eyebrow="Skills" title="기술">
        <dl className="divide-y divide-line rounded-[18px] bg-soft px-6">
          {skills.map((group) => (
            <div key={group.title} className="grid gap-2 py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-baseline">
              <dt className="text-sm font-bold text-heading">{group.title}</dt>
              <dd className="flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-body">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section id="education" eyebrow="Education & Certificates" title="교육 · 자격증">
        <div className="grid gap-10 sm:grid-cols-2">
          <MilestoneList title="교육" items={education} />
          <MilestoneList title="자격증" items={certificates} />
        </div>
      </Section>
    </div>
  );
}

function MilestoneList({ title, items }: { title: string; items: Milestone[] }) {
  return (
    <div>
      <h3 className="text-[15px] font-bold text-muted">{title}</h3>
      <ul className="mt-3 divide-y divide-line">
        {items.map((item) => (
          <li key={item.title} className="py-4">
            <p className="font-semibold text-heading">{item.title}</p>
            <p className="mt-1 text-sm text-muted tabular-nums">{item.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
