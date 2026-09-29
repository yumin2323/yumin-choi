# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (static)
- `npx tsc --noEmit` — type check
- There is no linter or test suite; verify changes with the type check, `npm run build`, and by viewing the page in both themes.

## Notes

- Single-page personal site (works, stories, timeline). Stack and design tokens mirror the sibling repo `yumin2323/yumin-devlog` (Next.js 16 App Router, React 19, Tailwind v4 CSS-first, next-themes). Path alias `@/*` → `src/*`.
- All content lives in `src/lib/resume.ts`; components only render it. UI copy uses the formal 합니다체. Strings in `resume.ts` may contain `**bold**` markup, which only renders as `<strong>` where a component passes the text through `RichText` in `src/components/section.tsx` (that file also holds the shared `Section`, `COLUMNS`, `TextLink`, `Highlights` primitives). Header nav items are `sections` in `src/lib/site.ts` and must match section `id`s in `src/app/page.tsx`.
- Colors are CSS variables in `src/app/globals.css`, defined for `:root` and `:root[data-theme="dark"]`; use the semantic Tailwind tokens (`text-heading`, `text-sub`, `bg-soft`, `border-line`, `text-accent`, `bg-accent-soft`) instead of raw palette colors. Light mode uses a pure white background.
- Theme-dependent UI is switched with `dark:` classes (keyed off `data-theme`), not by branching on `resolvedTheme` during render. Keep the `ThemeProvider` wrapper's `scriptProps` workaround.
- Layout is minimal and typographic: one 760px column; every section (and the hero) uses the shared `COLUMNS` grid (section name in a 140px left column, content on the right). No cards, panels, illustrations, tags, buttons or shadows; items are separated by whitespace, links are underlined `TextLink`s. The timeline is a vertical line with dots (`TreeDot`). Type is IBM Plex Sans KR (`next/font/google`, `--font-plex`) at weights 400/600 only — each extra weight adds ~100 Korean unicode-range slices, so don't add weights casually. Avoid uppercase English eyebrow labels, 01/02 numbering, and `·`-joined meta strings.
- UI copy and code comments are Korean; commit messages are English Conventional Commits.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
