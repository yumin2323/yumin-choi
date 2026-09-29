// 홈 히어로의 프로필 캐릭터. 색은 globals.css의 --avatar-* 변수라 라이트/다크 테마를 따라간다.
// 원형은 SVG에 rounded-full을 줘서 자르고, 골드는 머리핀 하나에만 쓴다.

export function Avatar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label="안경을 쓴 긴 머리 캐릭터" className={`block rounded-full ${className}`}>
      <rect width="120" height="120" fill="var(--avatar-bg)" />
      {/* 뒷머리 */}
      <path d="M32 58 C31 33 45 21 60 21 C75 21 89 33 88 58 L90 104 L30 104 Z" fill="var(--avatar-hair)" />
      {/* 목·상의 */}
      <rect x="53" y="70" width="14" height="18" rx="4" fill="var(--avatar-neck)" />
      <path d="M22 124 C22 99 38 87 60 87 C82 87 98 99 98 124 Z" fill="var(--avatar-shirt)" />
      <path d="M50 87.5 Q60 99 70 87.5 Z" fill="var(--avatar-collar)" />
      {/* 귀·얼굴 */}
      <circle cx="42" cy="57" r="3.6" fill="var(--avatar-skin)" />
      <circle cx="78" cy="57" r="3.6" fill="var(--avatar-skin)" />
      <ellipse cx="60" cy="55" rx="18" ry="20" fill="var(--avatar-skin)" />
      {/* 앞머리·머리핀 */}
      <path
        d="M41 54 C38 36 49 29 60.5 29.5 C72 30 82 37 79 54 C75 45.5 67.5 41 58 41 C51 41.5 45 46 41 54 Z"
        fill="var(--avatar-hair)"
      />
      <rect x="69" y="34.5" width="9" height="3" rx="1.5" transform="rotate(-24 73.5 36)" fill="var(--gold)" />
      {/* 안경·눈 */}
      <g fill="none" stroke="var(--avatar-hair)" strokeWidth="1.6">
        <circle cx="52.5" cy="57" r="6" />
        <circle cx="67.5" cy="57" r="6" />
        <path d="M58.5 57 H61.5" />
      </g>
      <circle cx="52.5" cy="57.5" r="1.5" fill="var(--avatar-hair)" />
      <circle cx="67.5" cy="57.5" r="1.5" fill="var(--avatar-hair)" />
      {/* 볼·입 */}
      <ellipse cx="46.5" cy="65" rx="2.8" ry="1.6" fill="var(--avatar-blush)" opacity="0.5" />
      <ellipse cx="73.5" cy="65" rx="2.8" ry="1.6" fill="var(--avatar-blush)" opacity="0.5" />
      <path d="M57 67 Q60 69.5 63 67" fill="none" stroke="var(--avatar-mouth)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
