import { Hero } from "@/components/hero";
import { ArrowLink, Num, READING, SHELL, Section, TextLink } from "@/components/section";
import { formatDate, getPosts } from "@/lib/blog";
import { about, expertise, findWork, profile, selectedWork } from "@/lib/resume";

export default async function HomePage() {
  const posts = (await getPosts()).filter((post) => post.featured).slice(0, 3);

  return (
    <div className={SHELL}>
      <Hero />

      <Section id="about" title="소개">
        <div className={`space-y-5 text-[17px] leading-[1.85] text-body ${READING}`}>
          {about.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </Section>

      <Section id="expertise" title="잘하는 일">
        <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
          {expertise.map((item, i) => (
            <li key={item.title}>
              <p className="text-sm">
                <Num n={i + 1} />
              </p>
              <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.02em] text-heading">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.75] text-sub">{item.text}</p>
              <ul className="mt-4 space-y-1 border-t border-line pt-4 text-sm leading-[1.7] text-muted">
                {item.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="work" title="대표 작업">
        <ol className="divide-y divide-line">
          {selectedWork.map((item, i) => {
            const work = findWork(item.work);
            return (
              <li key={item.title} className={`py-10 first:pt-0 last:pb-0 ${READING}`}>
                <p className="mb-2 text-sm">
                  <Num n={i + 1} />
                </p>
                <h3 className="text-[21px] leading-[1.45] font-semibold tracking-[-0.025em] text-balance text-heading">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-sub">{item.text}</p>
                <p className="mt-3 text-sm text-muted">
                  {work.name} · {work.category}
                </p>
                <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                  <ArrowLink href={`/resume#${work.id}`}>경력에서 보기</ArrowLink>
                  {work.post && <ArrowLink href={`/blog/${work.post}`}>관련 글</ArrowLink>}
                </p>
              </li>
            );
          })}
        </ol>
      </Section>

      <Section id="writing" title="대표 글">
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className={READING}>
              <h3 className="text-[17px] leading-[1.5] font-semibold tracking-[-0.02em] text-heading">
                <TextLink href={`/blog/${post.slug}`}>{post.title}</TextLink>
              </h3>
              <p className="mt-2 text-[15px] leading-[1.75] text-sub">{post.description}</p>
              <p className="mt-1.5 text-sm text-muted tabular-nums">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <ArrowLink href="/blog">모든 글 보기</ArrowLink>
        </p>
      </Section>

      <Section id="contact" title="연락처">
        <dl className="space-y-2 text-[15px]">
          {(
            [
              ["Email", `mailto:${profile.email}`, profile.email],
              ...profile.links.map(({ label, href }) => [label, href, href.replace(/^https?:\/\//, "")]),
              ["Resume", "/resume", "경력 자세히 보기"],
            ] as const
          ).map(([label, href, text]) => (
            <div key={label} className="grid grid-cols-[80px_minmax(0,1fr)] gap-4">
              <dt className="text-muted">{label}</dt>
              <dd>
                <TextLink href={href}>{text}</TextLink>
              </dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  );
}
