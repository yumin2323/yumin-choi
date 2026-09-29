# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (static)
- `npx tsc --noEmit` — type check
- There is no linter or test suite; verify changes with the type check, `npm run build`, and by viewing the page in both themes.

## Notes

- Personal site with three pages: `/` (Home — who I am: hero, about, expertise, selected work, selected writing, contact), `/resume` (full experience, projects, skills, education; "PDF로 저장" uses `window.print()` with `print:hidden`), and `/blog` + `/blog/[slug]`. Stack and design tokens mirror the sibling repo `yumin2323/yumin-devlog` (Next.js 16 App Router, React 19, Tailwind v4 CSS-first, next-themes). Path alias `@/*` → `src/*`.
- Site content lives in `src/lib/resume.ts`; components only render it. Home's selected work references `works` by `id` (also the `/resume#id` anchor); a work's `post` is a blog slug. UI copy uses the formal 합니다체. Strings in `resume.ts` may contain `**bold**` markup, which only renders as `<strong>` where a component passes the text through `RichText` in `src/components/section.tsx` (that file also holds the shared `SHELL`, `READING`, `COLUMNS`, `Section`, `TextLink`, `ArrowLink`, `Num`, `Highlights` primitives). Header nav items are `nav` in `src/lib/site.ts`.
- Blog posts are MDX files in `content/blog/<slug>.mdx` (`@next/mdx`, loaded by `src/lib/blog.ts`). Each exports `metadata` (`PostMeta`: title, description, date, tags, optional `work` id and `featured` for Home's 3 selected posts). Element styles are in `src/mdx-components.tsx`. MDX plugins must be given as strings in `next.config.ts` (Turbopack).
- Colors are CSS variables in `src/app/globals.css`, defined for `:root` and `:root[data-theme="dark"]`; use the semantic Tailwind tokens (`text-heading`, `text-sub`, `bg-soft`, `border-line`, `text-accent`, `bg-accent-soft`, `text-gold`) instead of raw palette colors. Light mode uses a pure white background. Gold is a micro accent only (numbers, arrows, link underlines on hover), never backgrounds or large headings.
- Theme-dependent UI is switched with `dark:` classes (keyed off `data-theme`), not by branching on `resolvedTheme` during render. Keep the `ThemeProvider` wrapper's `scriptProps` workaround.
- Layout is editorial and typographic: a 960px shell (`SHELL`); long prose is narrowed to 680px (`READING`) and blog articles to 720px. Every section (and each page header) uses the shared `COLUMNS` grid (section name in a 140px left column, content on the right), separated by thin top dividers. No cards, panels, illustrations, chips/pills, big CTA buttons or shadows; links are underlined `TextLink`s or `ArrowLink`s. Projects are numbered `01 —` with the number in gold; tech stacks and meta are plain `·`-joined text. Case-study titles use ~20–21px semibold, not big stat numbers. The resume timeline is a vertical line with dots (`TreeDot`). Type is IBM Plex Sans KR (`next/font/google`, `--font-plex`) at weights 400/600 only — each extra weight adds ~100 Korean unicode-range slices, so don't add weights casually. Avoid uppercase English eyebrow labels.
- UI copy and code comments are Korean; commit messages are English Conventional Commits.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
