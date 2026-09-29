import type { Metadata } from "next";
import { ArrowLink } from "@/components/section";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { findWork } from "@/lib/resume";

export async function generateStaticParams() {
  return (await getPosts()).map(({ slug }) => ({ slug }));
}

// 목록에 없는 주소는 404
export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { post } = await getPost((await params).slug);
  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { Content, post } = await getPost((await params).slug);
  const work = post.work ? findWork(post.work) : undefined;

  return (
    <article className="mx-auto max-w-[720px] pt-16 sm:pt-24">
      <header>
        <p className="text-sm text-muted tabular-nums">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
        <h1 className="mt-3 text-[28px] leading-[1.4] font-semibold tracking-[-0.03em] text-balance text-heading sm:text-[34px]">
          {post.title}
        </h1>
        <p className="mt-4 text-[17px] leading-[1.8] text-sub">{post.description}</p>
      </header>

      <div className="mt-12 border-t border-line pt-4 text-[16.5px] leading-[1.9] text-body">
        <Content />
      </div>

      <footer className="mt-16 space-y-4 border-t border-line pt-8 text-[15px] text-sub">
        {work && (
          <>
            <p>
              이 작업은 <span className="text-heading">{work.name}</span> 프로젝트에서 진행했습니다.
            </p>
            <p>
              <ArrowLink href={`/resume#${work.id}`}>Resume에서 관련 경력 보기</ArrowLink>
            </p>
          </>
        )}
        <p>
          <ArrowLink href="/blog">모든 글 보기</ArrowLink>
        </p>
      </footer>
    </article>
  );
}
