# yumin-choi

프론트엔드 개발자 최유민(Yumin Choi)의 개인 사이트. 이력, 프로젝트, 기술을 한 페이지에 정리합니다.

## Tech Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4**, 히어로 일러스트는 CSS Modules
- **next-themes**: 라이트/다크 테마 전환

디자인 토큰(색상, 폰트)은 [yumin-devlog](https://github.com/yumin2323/yumin-devlog)와 같습니다.

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```

## 내용 수정

화면에 보이는 이력 내용은 모두 `src/lib/resume.ts` 한 파일에 있습니다.

| 항목 | 설명 |
| --- | --- |
| `profile` | 이름, 한 줄 소개, 자기소개, 링크(GitHub · 이메일 · 블로그) |
| `experiences` | 경력. `start`/`end`는 `YYYY.MM`, 재직 중이면 `end` 생략 |
| `projects` | 프로젝트 카드 |
| `skills` | 기술 분류별 목록 |
| `education`, `activities` | 학력, 활동 · 수상 |

헤더 메뉴는 `src/lib/site.ts`의 `sections`에서 바꿉니다.
