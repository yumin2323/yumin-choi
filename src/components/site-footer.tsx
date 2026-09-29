import { profile } from "@/lib/resume";

export function SiteFooter() {
  return (
    <footer className="pt-10 pb-14 text-sm text-muted">
      <p className="mx-auto max-w-[760px]">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </footer>
  );
}
