import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { sections, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 -mx-5 border-b border-line bg-background/85 px-5 backdrop-blur">
      <div className="mx-auto flex h-15 max-w-[960px] items-center justify-between gap-4">
        <Link href="/" className="text-[19px] font-bold tracking-[-0.03em] text-heading">
          {site.title}
        </Link>
        <div className="flex items-center gap-1">
          {/* 좁은 화면에서는 메뉴를 숨기고 스크롤로 읽도록 */}
          <nav aria-label="섹션" className="hidden gap-1 sm:flex">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`/#${id}`}
                className="px-3 py-1.5 text-[15px] font-medium text-sub transition-colors hover:text-heading"
              >
                {label}
              </a>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
