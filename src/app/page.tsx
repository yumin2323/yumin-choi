import { Hero } from "@/components/hero";
import { Highlights, Section, TechChips } from "@/components/section";
import { formatDuration } from "@/lib/date";
import { activities, education, experiences, projects, skills, type Milestone } from "@/lib/resume";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-[880px]">
      <Hero />

      <Section id="experience" eyebrow="Experience" title="경력">
        <ol className="space-y-12">
          {experiences.map((job) => (
            <li key={`${job.company}-${job.start}`} className="grid gap-3 md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
              <div className="text-sm text-muted tabular-nums">
                <p>
                  {job.start} – {job.end ?? "현재"}
                </p>
                {job.end && <p className="mt-0.5">{formatDuration(job.start, job.end)}</p>}
              </div>
              <div>
                <h3 className="text-[21px] leading-[1.4] font-bold tracking-[-0.02em] text-heading">
                  {job.company}
                  {!job.end && (
                    <span className="ml-2 inline-block rounded-full bg-accent-soft px-2 py-0.5 align-middle text-xs font-semibold text-accent">
                      재직 중
                    </span>
                  )}
                </h3>
                <p className="mt-1 text-[15px] font-medium text-sub">{[job.team, job.role].filter(Boolean).join(" · ")}</p>
                <p className="mt-4 text-[15px] leading-[1.7] text-sub">{job.summary}</p>
                <div className="mt-4">
                  <Highlights items={job.highlights} />
                </div>
                <div className="mt-5">
                  <TechChips items={job.stack} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="projects" eyebrow="Projects" title="프로젝트">
        <ul className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.name} className="flex flex-col rounded-[18px] border border-line p-6 transition-colors hover:border-accent/50 hover:bg-soft/60">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-[19px] leading-[1.4] font-bold tracking-[-0.02em] text-heading">{project.name}</h3>
                <span className="shrink-0 text-sm text-muted tabular-nums">{project.period}</span>
              </div>
              <p className="mt-2 text-[15px] leading-[1.7] text-sub">{project.summary}</p>
              <div className="mt-4 flex-1">
                <Highlights items={project.highlights} />
              </div>
              <div className="mt-5">
                <TechChips items={project.stack} />
              </div>
              {project.links && project.links.length > 0 && (
                <div className="mt-5 flex gap-4 border-t border-line pt-4">
                  {project.links.map(({ label, href }) => (
                    <a key={href} href={href} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent hover:underline">
                      {label} ↗
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="skills" eyebrow="Skills" title="기술">
        <dl className="divide-y divide-line rounded-[18px] bg-soft px-6">
          {skills.map((group) => (
            <div key={group.title} className="grid gap-2 py-5 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center">
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

      <Section id="education" eyebrow="Education & More" title="학력 · 활동">
        <div className="grid gap-10 sm:grid-cols-2">
          <MilestoneList title="학력" items={education} />
          <MilestoneList title="활동 · 수상" items={activities} />
        </div>
      </Section>
    </div>
  );
}

function MilestoneList({ title, items }: { title: string; items: Milestone[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-[15px] font-bold text-muted">{title}</h3>
      <ul className="mt-3 divide-y divide-line">
        {items.map((item) => (
          <li key={`${item.title}-${item.period}`} className="py-4">
            <p className="font-bold text-heading">{item.title}</p>
            {item.detail && <p className="mt-0.5 text-[15px] text-sub">{item.detail}</p>}
            <p className="mt-1 text-sm text-muted tabular-nums">{item.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
