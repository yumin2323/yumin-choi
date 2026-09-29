"use client";

import { useTheme } from "next-themes";

/** 헤더의 라이트/다크 전환 버튼. 아이콘과 문구는 <html data-theme> 기준 CSS로 바뀌어 하이드레이션 차이가 없음 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-9 cursor-pointer place-items-center rounded-lg text-sub hover:bg-soft hover:text-heading"
    >
      <span className="sr-only dark:hidden">다크 모드로 전환</span>
      <span className="sr-only hidden dark:inline">라이트 모드로 전환</span>

      {/* 라이트일 때: 달 */}
      <svg
        viewBox="0 0 24 24"
        className="size-[18px] dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
      </svg>

      {/* 다크일 때: 해 */}
      <svg
        viewBox="0 0 24 24"
        className="hidden size-[18px] dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </button>
  );
}
