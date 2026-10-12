# yumin-choi

프론트엔드 개발자 최유민의 개인 사이트입니다. → **https://yumin-choi.vercel.app**

사이트 전체가 이 레포에 있습니다. Home에서는 저를 소개하고, Resume에서는 전체 경력을 정리하며(PDF로 저장 가능), Blog에는 인터랙티브 데모를 곁들인 문제 해결 기록을 남깁니다.

## 기술 스택

- **Next.js 16** (App Router, 정적 빌드) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (`src/app/globals.css`의 CSS-first 설정) · **next-themes** (라이트/다크 모드)
- **MDX** (`@next/mdx`, `remark-gfm`)로 글 작성 · **rehype-pretty-code** + **Shiki**로 빌드 시점 코드 하이라이팅
- **Vercel** 배포

## 디렉토리 구조

```
content/blog/          블로그 글 (<slug>.mdx)
docs/                  내부 가이드 (블로그 썸네일 규칙)
src/
  app/                 라우트: / (Home), /resume, /blog, /blog/[slug]
  components/          레이아웃, 섹션, 헤더/푸터, 아바타, 글 썸네일
    demos/             글에 들어가는 인터랙티브 데모
  lib/
    resume.ts          사이트 콘텐츠 전체 (프로필, 프로젝트, 경력, 기술)
    blog.ts            MDX 글 로드 및 정렬
    site.ts            사이트 메타데이터와 헤더 메뉴
  mdx-components.tsx   MDX 요소 스타일과 데모 등록
```

컴포넌트는 데이터를 렌더링만 합니다. 문구를 바꾸려면 `src/lib/resume.ts`를 수정합니다.

## 블로그와 데모

글은 `content/blog/<slug>.mdx`에 MDX 파일로 있고, 각 파일이 메타데이터를 export합니다.

```js
export const metadata = {
  title: "...",
  description: "...",
  date: "2026-09-29",
  tags: ["성능"],
  work: "owlite",   // 선택: Resume의 프로젝트와 연결
  featured: true,   // 선택: Home의 대표 글에 노출 (최대 3개)
};
```

글은 실제 업무에서 겪은 프론트엔드 문제(렌더링 병목, 스트리밍 상태 처리, 차트·그리드 커스터마이징, 스키마 기반 폼 등)와 그 해결 과정을 다룹니다. 대부분의 글에는 **인터랙티브 데모**(`src/components/demos/`)가 있습니다. 데모는 실제 문제를 공개 가능한 데이터와 코드로 다시 만든 작은 재현 예제라서, 원래 제품 밖에서도 공유할 수 있습니다. 데모는 `src/mdx-components.tsx`에 등록되어 있어 글에서 `<StreamBatchDemo />`처럼 import 없이 바로 씁니다.

글 썸네일은 `src/components/post-thumbnail.tsx`에 slug별 인라인 SVG로 들어 있습니다. 추가하거나 바꿀 때는 [docs/blog-thumbnail-guide.md](docs/blog-thumbnail-guide.md)를 따릅니다.

**글 작성에 대해:** 글은 AI의 도움을 받아(AI-assisted) 작성했습니다. 문제와 판단, 코드는 제 업무에서 나온 것이고, AI는 글의 구성과 문장 다듬기, 데모 구현을 도왔습니다. 게시 전에 모든 내용을 직접 검토하고 수정합니다.

## 로컬 실행

Node.js 20.9 이상이 필요합니다.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 프로덕션 빌드
npx tsc --noEmit     # 타입 체크
```
