import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { sections, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 -mx-5 bg-background/90 px-5 backdrop-blur">
      <div className="mx-auto flex h-15 max-w-[760px] items-center justify-between gap-4">
        <Link href="/" className="text-[15px] font-semibold text-heading">
          {site.title}
        </Link>
        <div className="flex items-center gap-1">
          {/* 좁은 화면에서는 메뉴를 숨기고 스크롤로 읽도록 */}
          <nav aria-label="섹션" className="hidden gap-1 sm:flex">
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={`/#${id}`}
                className="px-3 py-1.5 text-sm text-sub transition-colors hover:text-heading"
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
