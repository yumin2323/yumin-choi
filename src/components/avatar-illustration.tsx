import { useId } from "react";

/** 명함 사진 자리의 캐릭터 일러스트. 사진처럼 쓰이므로 테마와 관계없이 색을 고정 */
export function AvatarIllustration() {
  const clipId = useId();

  return (
    <svg viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="120" height="120" fill="#E6E0FA" />
        <path d="M31 60 C29 32 44 19 60 19 C76 19 91 32 89 60 L92 100 L28 100 Z" fill="#2F2638" />
        <rect x="52" y="68" width="16" height="20" rx="5" fill="#EBC1A6" />
        <path d="M20 124 C20 98 37 85 60 85 C83 85 100 98 100 124 Z" fill="#6D5BD0" />
        <path d="M49 86 Q60 101 71 86 Z" fill="#FFFFFF" />
        <circle cx="41.5" cy="56" r="4" fill="#F5D3BD" />
        <circle cx="78.5" cy="56" r="4" fill="#F5D3BD" />
        <ellipse cx="60" cy="54" rx="19" ry="21" fill="#F5D3BD" />
        <path d="M40 53 C37 34 49 27 61 28 C73 29 83 37 80 53 C75 44 67 39 57 39 C50 40 44 45 40 53 Z" fill="#2F2638" />
        <rect x="70" y="33" width="9" height="3.2" rx="1.6" transform="rotate(-24 74.5 34.6)" fill="#8B7BE0" />
        <g fill="none" stroke="#2F2638" strokeWidth="1.8">
          <circle cx="52" cy="56" r="6.5" />
          <circle cx="68" cy="56" r="6.5" />
          <path d="M58.5 56 H61.5" />
        </g>
        <circle cx="52" cy="56.5" r="1.7" fill="#2F2638" />
        <circle cx="68" cy="56.5" r="1.7" fill="#2F2638" />
        <ellipse cx="46" cy="64" rx="3.2" ry="1.9" fill="#F2A39B" opacity="0.55" />
        <ellipse cx="74" cy="64" rx="3.2" ry="1.9" fill="#F2A39B" opacity="0.55" />
        <path d="M56 66 Q60 69.5 64 66" fill="none" stroke="#B9675F" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="78.5" cy="62" r="1.5" fill="#8B7BE0" />
      </g>
    </svg>
  );
}
