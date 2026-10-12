import { SHELL } from "@/components/section";
import { profile } from "@/lib/resume";

export function SiteFooter() {
  return (
    <footer className="pt-10 pb-14 text-sm text-muted print:hidden">
      <p className={`${SHELL} text-right`}>
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
