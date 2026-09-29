import { Avatar } from "@/components/avatar";
import { COLUMNS, READING, TextLink } from "@/components/section";
import { profile } from "@/lib/resume";

export function Hero() {
  return (
    <section className={`pt-20 pb-14 sm:pt-32 sm:pb-20 ${COLUMNS}`}>
      {/* 다른 구역의 섹션 이름 자리. 모바일에서는 제목 위로 올라감 */}
      <Avatar className="mb-8 size-16 md:mt-1.5 md:mb-0 md:size-28" />
      <div>
        <h1 className="text-[34px] leading-[1.3] font-semibold tracking-[-0.035em] whitespace-pre-line text-heading sm:text-[44px]">
          {profile.headline}
        </h1>
        <div className={`mt-10 space-y-4 text-base leading-[1.85] text-sub ${READING}`}>
          <p className="text-heading">{profile.intro}</p>
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
