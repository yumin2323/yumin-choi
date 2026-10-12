import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import { createCssVariablesTheme } from "shiki";

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ["ts", "tsx", "mdx"],
};

// 코드 블록 색을 globals.css의 --shiki-* 변수로 칠하는 테마. 라이트/다크는 변수 값이 바꾼다.
// 함수가 아닌 일반 객체라서 Turbopack에도 옵션으로 넘길 수 있다
const codeTheme = createCssVariablesTheme({ name: "css-variables", variablePrefix: "--shiki-", fontStyle: true });

// 블로그 글(content/blog/*.mdx)을 컴포넌트로 불러오기 위한 설정.
// Turbopack에서는 플러그인을 함수가 아닌 패키지 이름(문자열)으로 넘겨야 한다. remark-gfm은 표 문법용,
// rehype-pretty-code는 빌드할 때 코드 블록에 문법 강조와 줄 강조(```ts {3-5})를 입힌다
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [["rehype-pretty-code", { theme: codeTheme, keepBackground: false }]],
  },
});

export default withMDX(nextConfig);
