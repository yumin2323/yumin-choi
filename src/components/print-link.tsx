"use client";

/** 브라우저 인쇄 창을 열어 Resume을 PDF로 저장하게 한다 */
export function PrintLink() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group inline-flex cursor-pointer items-baseline gap-1.5 text-heading print:hidden"
    >
      <span className="link-underline">PDF로 저장</span>
      <span aria-hidden="true" className="text-gold">
        ↗
      </span>
    </button>
  );
}
