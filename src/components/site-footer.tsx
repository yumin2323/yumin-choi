import { profile } from "@/lib/resume";

export function SiteFooter() {
  return (
    <footer className="border-t border-line pt-8 pb-12 text-sm text-muted">
      <div className="mx-auto flex max-w-[960px] flex-wrap justify-between gap-3">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Next.js와 Tailwind CSS로 만들었습니다</span>
      </div>
    </footer>
  );
}
