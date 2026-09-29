import { AvatarIllustration } from "@/components/avatar-illustration";
import { profile } from "@/lib/resume";
import styles from "./hero.module.css";

// 아바타 주위에 떠 있는 기술 칩 (위치는 CSS 모듈의 nth-child로 지정)
const FLOATING_CHIPS = ["React", "Next.js", "TypeScript"];

export function Hero() {
  return (
    <section className="grid items-center gap-10 pt-14 pb-20 sm:pt-20 sm:pb-24 md:grid-cols-[minmax(0,1fr)_240px] md:gap-14">
      <div>
        <a
          href={profile.now.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-soft py-1.5 pr-3.5 pl-3 text-sm text-sub hover:text-heading"
        >
          <span className={styles.pulse} aria-hidden="true" />
          <span className="font-bold text-heading">{profile.now.label}</span>
          {profile.now.text}
        </a>
        <h1 className="mt-6 text-[30px] leading-[1.35] font-bold tracking-[-0.035em] whitespace-pre-line text-heading sm:text-[42px]">
          {profile.greeting}
        </h1>
        <div className="mt-6 max-w-[34em] space-y-3 text-[17px] leading-[1.8] text-sub">
          {profile.intro.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
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
