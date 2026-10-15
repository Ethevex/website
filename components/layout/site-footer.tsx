import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const footerLinks = [
  { label: "GitHub", href: "https://github.com/Ethevex" },
  { label: "Creator", href: "https://github.com/DavidAsrorxonov" },
];

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-6xl border-t border-foreground/15 py-8 sm:py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-lg font-medium tracking-[-0.03em]">Ethevex</p>
          <p className="mt-2 text-sm text-foreground/65">© 2026 Ethevex</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <Link href="/brand" className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
                Brand
              </Link>
            </li>
            {footerLinks.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                >
                  {label}
                  <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
