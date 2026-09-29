import { profile } from "@/lib/resume";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line pt-8 pb-12 text-sm text-muted">
      <div className="mx-auto flex max-w-[880px] flex-wrap justify-between gap-3">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <ul className="flex gap-4">
          {profile.links.map(({ label, href }) => (
            <li key={href}>
              <a href={href} target="_blank" rel="noreferrer" className="hover:text-heading">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
