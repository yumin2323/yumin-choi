# yumin-choi

Personal site of Yumin Choi (최유민), a frontend developer. Home introduces who I am, Resume lists the full career history, and Blog records problem-solving write-ups.

## Tech Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS 4** (CSS-first config in `src/app/globals.css`)
- **next-themes** for light/dark theme switching
- **MDX** (`@next/mdx`, `remark-gfm`) for blog posts

Design tokens (colors, fonts) are shared with [yumin-devlog](https://github.com/yumin2323/yumin-devlog).

## Getting Started

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npx tsc --noEmit     # type check
```

## Editing Content

Site content lives in `src/lib/resume.ts`.

| Export | Description |
| --- | --- |
| `profile` | Headline, intro, the "now" line, core stack, email, and links (Home hero and Resume header) |
| `about`, `expertise`, `selectedWork` | Home sections. `selectedWork[].work` points to a `works` item by `id` |
| `works` | Resume projects. `id` is the `/resume#id` anchor, `post` links a related blog slug, `highlights` text may use `**bold**` |
| `timeline`, `education`, `skills` | Resume experience, education, and skills |

Blog posts are MDX files in `content/blog/<slug>.mdx`. Each file exports its metadata:

```js
export const metadata = {
  title: "...",
  description: "...",
  date: "2026-09-29",
  tags: ["성능"],
  work: "owlite",   // optional: links the post to a Resume project
  featured: true,   // optional: shown in Home's selected writing (up to 3)
};
```

A post's thumbnail is an inline SVG registered under its slug in `src/components/post-thumbnail.tsx`; posts without one simply show no image.

Header navigation items are defined in `nav` in `src/lib/site.ts`.
