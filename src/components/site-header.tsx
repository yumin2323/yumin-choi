import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { SHELL } from "@/components/section";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 -mx-5 bg-background/90 px-5 backdrop-blur print:hidden">
      <div className={`${SHELL} flex h-15 items-center justify-between gap-4`}>
        <Link href="/" className="text-[15px] font-semibold whitespace-nowrap text-heading">
          {site.title}
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <SiteNav />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
