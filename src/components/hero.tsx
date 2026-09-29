import { COLUMNS, READING, TextLink } from "@/components/section";
import { profile } from "@/lib/resume";

export function Hero() {
  return (
    <section className={`pt-20 pb-14 sm:pt-32 sm:pb-20 ${COLUMNS}`}>
      {/* 본문이 다른 구역과 같은 세로선에서 시작하도록 왼쪽 칸은 비워 둠 */}
      <div aria-hidden="true" />
      <div>
        <h1 className="text-[34px] leading-[1.3] font-semibold tracking-[-0.035em] whitespace-pre-line text-heading sm:text-[44px]">
          {profile.headline}
        </h1>
        <div className={`mt-10 space-y-4 text-base leading-[1.85] text-sub ${READING}`}>
          {profile.intro.map((line, i) => (
            <p key={line} className={i === 0 ? "text-heading" : undefined}>
              {line}
            </p>
          ))}
          <p>
            <TextLink href={profile.now.href}>{profile.now.text}</TextLink>
          </p>
        </div>
        <p className="mt-6 text-sm text-muted">{profile.coreStack.join(" · ")}</p>
        <p className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
          <TextLink href={`mailto:${profile.email}`}>{profile.email}</TextLink>
          {profile.links.map(({ label, href }) => (
            <TextLink key={href} href={href}>
              {label}
            </TextLink>
          ))}
        </p>
      </div>
    </section>
  );
}
