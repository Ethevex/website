"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const sections = [
  { href: "#components", label: "Components" },
  { href: "#assets", label: "Assets" },
  { href: "#guidelines", label: "Guidelines" },
];

export function BrandNavbar() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const page = header?.closest<HTMLElement>("[data-brand-page]");
    if (!header || !page) return;

    const measure = () => {
      page.style.setProperty("--brand-header-height", `${header.getBoundingClientRect().height}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    // Correct a direct hash visit after the actual, possibly wrapped header is measured.
    const initialScroll = requestAnimationFrame(() => {
      const id = window.location.hash.slice(1);
      if (["brand-main", "components", "assets", "guidelines"].includes(id)) {
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      }
    });
    return () => {
      cancelAnimationFrame(initialScroll);
      observer.disconnect();
      page.style.removeProperty("--brand-header-height");
    };
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-30 max-h-[calc(100svh-4rem)] overflow-y-auto border-b border-foreground/15 bg-background px-6 sm:px-12 lg:px-20">
      <a href="#brand-main" className="absolute top-4 left-6 z-40 -translate-y-32 bg-foreground px-4 py-3 text-background focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
        Skip to content
      </a>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-4 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:gap-x-10">
        <Link href="/" className="inline-flex min-h-11 w-fit items-center gap-3 text-lg font-medium tracking-[-0.03em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
          <span aria-hidden="true"><BrandLogo variant="sculptural" className="w-7" /></span>
          Ethevex
        </Link>
        <nav aria-label="Brand sections" className="order-3 col-span-2 pt-2 lg:order-2 lg:col-span-1 lg:justify-self-end lg:pt-0">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 sm:gap-x-8">
            {sections.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="order-2 lg:order-3"><ThemeToggle /></div>
      </div>
    </header>
  );
}
