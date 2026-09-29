import { readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { Work } from "@/lib/resume";

// 블로그 글은 content/blog/<slug>.mdx에 두고, 각 파일은 `export const metadata = { ... }`로 정보를 내보낸다.

export type PostMeta = {
  title: string;
  description: string;
  /** YYYY-MM-DD */
  date: string;
  tags: string[];
  /** 이 글의 작업이 이뤄진 프로젝트. Resume의 해당 프로젝트로 연결된다 */
  work?: Work["id"];
  /** 홈의 대표 글에 보일지 여부 */
  featured?: boolean;
};

export type Post = PostMeta & { slug: string };

const POSTS_DIR = path.join(process.cwd(), "content/blog");

async function loadModule(slug: string) {
  return (await import(`../../content/blog/${slug}.mdx`)) as { default: ComponentType; metadata: PostMeta };
}

/** 최신 글부터 */
export async function getPosts(): Promise<Post[]> {
  const files = (await readdir(POSTS_DIR)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { metadata } = await loadModule(slug);
      return { ...metadata, slug };
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string) {
  const { default: Content, metadata } = await loadModule(slug);
  return { Content, post: { ...metadata, slug } satisfies Post };
}

/** 2026-09-29 → 2026년 9월 29일 */
export function formatDate(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}
