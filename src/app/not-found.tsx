import type { Metadata } from "next";
import { ArrowLink, SHELL } from "@/components/section";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없음",
};

export default function NotFound() {
  return (
    <div className={`${SHELL} pt-12 sm:pt-20`}>
      <p className="text-sm text-gold tabular-nums">404</p>
      <h1 className="mt-2.5 text-[28px] leading-[1.35] font-semibold tracking-[-0.03em] text-heading sm:text-[34px]">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-4 text-[17px] leading-[1.8] text-sub">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <p className="mt-8">
        <ArrowLink href="/">홈으로 가기</ArrowLink>
      </p>
    </div>
  );
}
