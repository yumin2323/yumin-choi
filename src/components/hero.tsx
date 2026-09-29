import { Button } from "@/components/section";
import { profile } from "@/lib/resume";
import styles from "./hero.module.css";

export function Hero() {
  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24">
      <p className="text-[15px] font-medium text-sub sm:text-[17px]">{profile.greeting}</p>
      <h1 className="mt-5 text-[34px] leading-[1.2] font-bold tracking-[-0.045em] whitespace-pre-line text-heading sm:text-[54px] md:text-[64px]">
        {profile.headline}
      </h1>

      <div className="mt-12 grid gap-10 border-t border-line pt-10 sm:mt-16 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14">
        <div>
          <div className="max-w-[36em] space-y-4 text-base leading-[1.8] text-sub">
            {profile.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            <Button href="#works">프로젝트 보기</Button>
            {profile.links.map(({ label, href }) => (
              <Button key={href} href={href} variant="outline" external>
                {label} ↗
              </Button>
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-[108px_minmax(0,1fr)] gap-x-4 gap-y-3.5 self-start text-[15px]">
          {profile.facts.map(({ label, value, href }) => (
            <div key={label} className="contents">
              <dt className="eyebrow pt-[3px]">{label}</dt>
              <dd className="font-medium text-heading">
                {href ? (
                  <a href={href} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-2">
                    <span className={styles.pulse} aria-hidden="true" />
                    {value} <span className="text-gold">↗</span>
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
