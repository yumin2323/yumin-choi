# CLAUDE.md

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (static)
- `npx tsc --noEmit` — type check

## Notes

- Single-page personal site (works, stories, timeline, contact). Stack and design tokens mirror the sibling repo `yumin2323/yumin-devlog` (Next.js 16 App Router, React 19, Tailwind v4 CSS-first, next-themes). Path alias `@/*` → `src/*`.
- All content lives in `src/lib/resume.ts`; components only render it. UI copy uses the formal 합니다체. Header nav items are `sections` in `src/lib/site.ts` and must match section `id`s in `src/app/page.tsx`.
- Colors are CSS variables in `src/app/globals.css`, defined for `:root` and `:root[data-theme="dark"]`; use the semantic Tailwind tokens (`text-heading`, `text-sub`, `bg-soft`, `border-line`, `text-accent`, `bg-accent-soft`) instead of raw palette colors. `text-gold` is for small accents only (project numbers, arrows, hover underlines), never large surfaces or buttons.
- Theme-dependent UI is switched with `dark:` classes (keyed off `data-theme`), not by branching on `resolvedTheme` during render. Keep the `ThemeProvider` wrapper's `scriptProps` workaround.
- Layout is editorial: thin `border-line` rules between rows instead of cards, `rounded-lg` at most, no shadows. Small English labels use the `eyebrow` utility; link hovers use `link-underline`.
- UI copy and code comments are Korean; commit messages are English Conventional Commits.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
