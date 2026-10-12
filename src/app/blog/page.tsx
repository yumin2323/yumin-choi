import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { hasThumbnail, PostThumbnail } from "@/components/post-thumbnail";
import { COLUMNS, SHELL } from "@/components/section";
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
          <li key={post.slug} className={`border-b border-line py-9 sm:py-10 ${COLUMNS}`}>
            {/* 날짜와 태그. 날짜 줄의 높이를 제목 줄(29px)과 같게 해서 첫 줄이 나란히 놓이게 한다 */}
            <p className="mb-2 text-[13px] leading-[1.7] text-muted md:mb-0">
              <time dateTime={post.date} className="text-sm leading-[29px] text-sub tabular-nums md:block">
                {formatDate(post.date)}
              </time>
              {/* 태그 하나는 줄바꿈으로 쪼개지지 않게, 줄바꿈은 태그 사이에서만 */}
              <span className="before:mx-1.5 before:content-['·'] md:mt-1 md:block md:before:content-none">
                {post.tags.map((tag, i) => (
                  <Fragment key={tag}>
                    {i > 0 && " · "}
                    <span className="whitespace-nowrap">{tag}</span>
                  </Fragment>
                ))}
              </span>
            </p>
            {/* 글 정보와 썸네일의 높이를 맞춰 줄마다 같은 리듬이 되게 한다. 설명은 목록에서 두 줄까지만.
                제목 링크의 ::after가 article 전체를 덮어서 어디를 눌러도 글로 가고, 스크린 리더에는 제목 링크 하나만 읽힌다 */}
            <article className="group relative grid gap-5 sm:grid-cols-[minmax(0,1fr)_224px] sm:gap-9">
              <div className="min-w-0 sm:order-1">
                <h2 className="text-[20px] leading-[29px] font-semibold tracking-[-0.025em] text-balance text-heading">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline decoration-transparent decoration-1 underline-offset-[5px] transition-colors group-hover:decoration-gold focus-visible:decoration-gold after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-[10px] focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-[var(--focus)]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 line-clamp-2 text-[15px] leading-[1.75] text-sub">{post.description}</p>
              </div>
              {hasThumbnail(post.slug) && (
                <div className="-order-1 sm:order-2">
                  <PostThumbnail slug={post.slug} />
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>
    </div>
  );
}
