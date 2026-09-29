import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  pageExtensions: ["ts", "tsx", "mdx"],
};

// 블로그 글(content/blog/*.mdx)을 컴포넌트로 불러오기 위한 설정.
// Turbopack에서는 플러그인을 함수가 아닌 패키지 이름(문자열)으로 넘겨야 한다. remark-gfm은 표 문법용
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
  },
});

export default withMDX(nextConfig);
