"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

/** 헤더 메뉴. 지금 보고 있는 페이지는 글자색으로만 표시 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="주 메뉴" className="flex">
      {nav.map(({ href, label }) => {
        // /blog는 /blog와 /blog/<slug>에서만 현재 메뉴. /blogroll처럼 앞부분만 같은 주소는 제외
        const current = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={current ? "page" : undefined}
            className={`px-2 py-1.5 text-sm transition-colors hover:text-heading sm:px-2.5 ${current ? "text-heading" : "text-sub"}`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
