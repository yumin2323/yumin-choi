"use client";

import { useId, useState, type ReactNode } from "react";

type Props = {
  /** 데모 제목. 위쪽 구분선 아래에 표시 */
  title: string;
  /** "최적화 전" 상태 설명 한 줄 */
  beforeNote: string;
  /** "최적화 후" 상태 설명 한 줄 */
  afterNote: string;
  /** 하단 안내 문구(조작 방법 등). 선택 */
  hint?: string;
  /** 현재 모드에 맞는 내용을 그린다. 모드가 바뀌면 key가 바뀌어 내부 상태가 초기화됨 */
  children: (optimized: boolean) => ReactNode;
};

/**
 * 글 안에서 "최적화 전 / 후"를 토글로 비교하는 데모 껍데기. 카드 대신 위아래 구분선으로 본문과 나눈다.
 * 개별 데모 컴포넌트가 이 안에 실제 내용을 그린다. 색은 전역 토큰만 사용.
 */
export function BeforeAfter({ title, beforeNote, afterNote, hint, children }: Props) {
  const [optimized, setOptimized] = useState(false);
  const [round, setRound] = useState(0);
  const groupId = useId();

  return (
    <figure className="my-10 border-y border-line py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <figcaption className="text-[15px] font-semibold text-heading">{title}</figcaption>

        <div role="radiogroup" aria-labelledby={groupId} className="flex gap-4 text-sm">
          <span id={groupId} className="sr-only">
            비교 모드
          </span>
          {(
            [
              [false, "최적화 전"],
              [true, "최적화 후"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={optimized === value}
              onClick={() => setOptimized(value)}
              className={
                "cursor-pointer underline-offset-4 transition-colors " +
                (optimized === value
                  ? "font-semibold text-accent underline decoration-gold"
                  : "text-sub hover:text-heading")
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 text-sm leading-[1.75] text-sub">{optimized ? afterNote : beforeNote}</p>

      <div key={`${optimized}-${round}`} className="mt-5">
        {children(optimized)}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2 text-[13px] text-muted">
        <span>{hint}</span>
        <button
          type="button"
          onClick={() => setRound((r) => r + 1)}
          className="cursor-pointer text-sub underline underline-offset-4 decoration-line hover:text-heading"
        >
          초기화
        </button>
      </div>
    </figure>
  );
}
