import { AvatarIllustration } from "@/components/avatar-illustration";
import { profile } from "@/lib/resume";
import styles from "./hero.module.css";

// 아바타 주위에 떠 있는 기술 칩 (위치는 CSS 모듈의 nth-child로 지정)
const FLOATING_CHIPS = ["React", "Next.js", "TypeScript"];

export function Hero() {
  return (
    <section className="grid items-center gap-10 pt-14 pb-16 sm:pt-20 sm:pb-20 md:grid-cols-[minmax(0,1fr)_240px] md:gap-14">
      <div>
        <p className="text-[15px] font-bold text-accent">
          {profile.nameKo} · {profile.role}
        </p>
        <h1 className="mt-3 text-[32px] leading-[1.3] font-bold tracking-[-0.035em] text-balance text-heading sm:text-[44px]">
          {profile.headline}
        </h1>
        <div className="mt-6 space-y-2 text-[17px] leading-[1.8] text-sub">
          {profile.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <ul className="mt-8 flex flex-wrap gap-2">
          {profile.links.map(({ label, href }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-1.5 rounded-[10px] border border-line px-4 text-[15px] font-semibold text-heading hover:border-accent hover:text-accent"
              >
                {label}
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M5 11 11 5M6 5h5v5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.panel} aria-hidden="true">
        <div className={styles.avatar}>
          <AvatarIllustration />
        </div>
        {FLOATING_CHIPS.map((label) => (
          <span key={label} className={styles.chip}>
            {label}
          </span>
        ))}
      </div>
    </section>
  );
}
