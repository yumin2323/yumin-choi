# CLAUDE.md

## Commands

- `npm run dev` — dev server (http://localhost:3000)
- `npm run build` — production build (static)
- `npx tsc --noEmit` — type check

## Notes

- Single-page personal résumé site. Stack and design tokens mirror the sibling repo `yumin2323/yumin-devlog` (Next.js 16 App Router, React 19, Tailwind v4 CSS-first, next-themes). Path alias `@/*` → `src/*`.
- All résumé content lives in `src/lib/resume.ts`; components only render it. Header nav items are `sections` in `src/lib/site.ts` and must match section `id`s in `src/app/page.tsx`.
- Colors are CSS variables in `src/app/globals.css`, defined for `:root` and `:root[data-theme="dark"]`; use the semantic Tailwind tokens (`text-heading`, `text-sub`, `bg-soft`, `border-line`, `text-accent`, `bg-accent-soft`) instead of raw palette colors.
- Theme-dependent UI is switched with `dark:` classes (keyed off `data-theme`), not by branching on `resolvedTheme` during render. Keep the `ThemeProvider` wrapper's `scriptProps` workaround.
- UI copy and code comments are Korean; commit messages are English Conventional Commits.
