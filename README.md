# yumin-choi

Personal site of Yumin Choi (최유민), a frontend developer. A single page that brings together selected work, problem-solving stories, and career history.

## Tech Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (CSS-first config in `src/app/globals.css`)
- **next-themes** for light/dark theme switching

Design tokens (colors, fonts) are shared with [yumin-devlog](https://github.com/yumin2323/yumin-devlog).

## Getting Started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npx tsc --noEmit     # type check
```

## Editing Content

Everything shown on the page lives in a single file, `src/lib/resume.ts`.

| Export | Description |
| --- | --- |
| `profile` | Greeting, headline, intro, the "now" line in the hero, email, and links |
| `works` | Projects. `stack` shows its first 3 items in the list and the full list when expanded; `highlights` appear under "자세히 보기"; the optional `outcome` renders a before/after bar sized by `ratio` (after ÷ before) |
| `stories` | Problem → approach → result write-ups |
| `timeline`, `education` | Career history |
| `skills` | Tools grouped by area |

In a `works` highlight's `text`, wrap words in `**double asterisks**` to render them bold. Other fields show the asterisks as plain text.

Header navigation items are defined in `sections` in `src/lib/site.ts`; each `id` must match a section `id` in `src/app/page.tsx`.
