import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없음",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[760px] pt-12 sm:pt-20">
      <p className="text-sm font-semibold text-accent tabular-nums">404</p>
      <h1 className="mt-2.5 text-[28px] leading-[1.35] font-semibold tracking-[-0.03em] text-heading sm:text-[34px]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-4 text-[17px] leading-[1.8] text-sub">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-[10px] bg-accent px-[18px] text-[15px] font-semibold text-background hover:bg-accent-hover"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
