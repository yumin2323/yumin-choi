# yumin-choi

프론트엔드 개발자 최유민(Yumin Choi)의 개인 사이트. 작업, 문제 해결 이야기, 걸어온 길을 한 페이지에 담았습니다.

## Tech Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4**, 히어로와 작업 카드 일러스트는 CSS Modules
- **next-themes**: 라이트/다크 테마 전환

디자인 토큰(색상, 폰트)은 [yumin-devlog](https://github.com/yumin2323/yumin-devlog)와 같습니다.

## Getting Started

```bash
npm install
npm run dev     # http://localhost:3000
```

## 내용 수정

화면에 보이는 내용은 모두 `src/lib/resume.ts` 한 파일에 있습니다.

| 항목 | 설명 |
| --- | --- |
| `profile` | 인사말, 자기소개, "지금" 배지, 이메일과 링크 |
| `works` | 작업 카드. `illustration`으로 그림 종류 선택, `highlights`는 "자세히 보기"에 표시 |
| `stories` | 문제 → 해결 → 결과 형식의 이야기와 전후 수치 |
| `timeline`, `education` | 걸어온 길 타임라인 |
| `skills` | 손에 익은 도구 |

문장 안에 `**굵게**`로 쓰면 화면에서 강조됩니다.

헤더 메뉴는 `src/lib/site.ts`의 `sections`에서 바꿉니다.
