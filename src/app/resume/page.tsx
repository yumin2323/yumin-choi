import type { Metadata } from "next";
import { PrintLink } from "@/components/print-link";
import { ArrowLink, COLUMNS, Highlights, Num, OutcomeLine, READING, SHELL, Section, TextLink } from "@/components/section";
import {
  careerSummary,
  education,
  profile,
  sideProjects,
  sideProjectsSummary,
  skills,
  timeline,
  works,
  type Media,
  type MediaSet,
  type Work,
} from "@/lib/resume";

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
        <p className="mb-8 max-w-[680px] text-[17px] leading-[1.8] text-heading">{careerSummary}</p>
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
            <WorkItem key={work.id} work={work} n={i + 1} />
          ))}
        </ol>
      </Section>

      <Section id="side-projects" title="사이드 프로젝트">
        <p className="mb-10 max-w-[680px] text-[15px] leading-[1.8] text-sub">{sideProjectsSummary}</p>
        <ol className="divide-y divide-line">
          {sideProjects.map((work, i) => (
            <WorkItem key={work.id} work={work} n={i + 1} />
          ))}
        </ol>
      </Section>

      <Section id="skills" title="기술">
        <dl className="space-y-2 text-[15px] leading-[1.75]">
          {skills.map((group) => (
            <div key={group.title} className="sm:grid sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4">
              <dt className="text-muted">{group.title}</dt>
              <dd className="text-body">{group.items.join(" · ")}</dd>
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

/** 프로젝트 한 건. 프로젝트와 사이드 프로젝트 목록이 같이 쓴다 */
function WorkItem({ work, n }: { work: Work; n: number }) {
  return (
    <li id={work.id} className="scroll-mt-[76px] py-12 first:pt-0 last:pb-0">
      <article>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-[21px] font-semibold tracking-[-0.025em] text-heading">
            {/* 번호와 대시를 한 덩어리로 묶어 줄바꿈·간격이 벌어지지 않게 */}
            <span className="mr-2.5 text-[15px] font-normal whitespace-nowrap">
              <Num n={n} />
              <span className="ml-1.5 text-gold">—</span>
            </span>
            {work.url ? <TextLink href={work.url}>{work.name}</TextLink> : work.name}
          </h3>
          <p className="text-sm text-muted tabular-nums">{work.period}</p>
        </div>
        <p className="mt-1 text-sm text-muted">
          {work.category}
          {work.status && ` · ${work.status}`}
        </p>
        {work.motive && <p className={`mt-4 text-[15px] leading-[1.8] text-sub ${READING}`}>{work.motive}</p>}
        {work.media && (
          <ul
            className={`mt-8 grid gap-4 sm:gap-6 ${work.media.shape === "phone" ? "max-w-[560px] grid-cols-3" : "sm:grid-cols-2"}`}
          >
            {work.media.items.map((item) => (
              <li key={item.image}>
                <Shot item={item} name={work.name} shape={work.media!.shape} />
              </li>
            ))}
          </ul>
        )}
        {work.outcome && (
          <div className={`mt-4 ${READING}`}>
            <OutcomeLine outcome={work.outcome} />
          </div>
        )}
        {work.impact && (
          <p className={`mt-2 text-[15px] leading-[1.8] text-sub ${READING}`}>
            제품 성과<span className="ml-2 text-heading">{work.impact}</span>
          </p>
        )}
        <div className={`mt-6 ${READING}`}>
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
  );
}

/** 화면 캡처 한 장. 영상은 GIF처럼 소리 없이 반복 재생한다 */
function Shot({ item, name, shape }: { item: Media; name: string; shape: MediaSet["shape"] }) {
  const label = `${name} ${item.caption} 화면`;
  const [width, height] = shape === "phone" ? [600, 1305] : [1200, 750];
  const className = `block w-full border border-line ${shape === "phone" ? "aspect-[600/1305]" : "aspect-[16/10]"}`;
  return (
    <figure>
      {item.video ? (
        <video
          src={item.video}
          poster={item.image}
          aria-label={label}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={className}
        />
      ) : (
        <img src={item.image} alt={label} width={width} height={height} loading="lazy" className={className} />
      )}
      <figcaption className="mt-2 text-[13px] leading-[1.6] text-muted">{item.caption}</figcaption>
    </figure>
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
