import type { Metadata } from "next";
import Link from "next/link";
import { hasThumbnail, PostThumbnail } from "@/components/post-thumbnail";
import { COLUMNS, SHELL, TextLink } from "@/components/section";
import { formatDate, getPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "기술 경험과 문제 해결 과정을 기록합니다.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className={SHELL}>
      <header className={`pt-16 pb-14 sm:pt-24 sm:pb-16 ${COLUMNS}`}>
        <div aria-hidden="true" />
        <div>
          <h1 className="text-[30px] leading-[1.3] font-semibold tracking-[-0.03em] text-heading sm:text-[36px]">글</h1>
          <p className="mt-3 text-[17px] leading-[1.8] text-sub">일하며 부딪힌 문제와 해결 과정을 기록합니다.</p>
        </div>
      </header>

      <ol className="border-t border-line">
        {posts.map((post) => (
          <li key={post.slug} className={`border-b border-line py-10 ${COLUMNS}`}>
            <p className="mb-2 text-sm leading-[1.9] text-muted tabular-nums md:mb-0">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </p>
            <article className="max-w-[680px]">
              {/* 썸네일은 제목 링크와 같은 곳으로 가지만, 스크린 리더에는 제목 링크 하나만 읽히게 */}
              {hasThumbnail(post.slug) && (
                <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="mb-6 block">
                  <PostThumbnail slug={post.slug} />
                </Link>
              )}
              <h2 className="text-[20px] leading-[1.45] font-semibold tracking-[-0.025em] text-balance text-heading">
                <TextLink href={`/blog/${post.slug}`}>{post.title}</TextLink>
              </h2>
              <p className="mt-2.5 text-[15px] leading-[1.8] text-sub">{post.description}</p>
              <p className="mt-3 text-[13px] text-muted">{post.tags.join(" · ")}</p>
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
