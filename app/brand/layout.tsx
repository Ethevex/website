import { Space_Mono } from "next/font/google";

import { BrandNavbar } from "@/components/brand/brand-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import "./brand.css";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand-page className={`brand-page ${spaceMono.variable}`}>
      <BrandNavbar />
      <main
        id="brand-main"
        tabIndex={-1}
        className="mx-auto w-full max-w-300 px-6 pb-24 focus:outline-none sm:max-w-312 sm:px-12 lg:max-w-328 lg:px-20"
      >
        {children}
      </main>
      <div className="px-6 sm:px-12 lg:px-20">
        <SiteFooter />
      </div>
    </div>
  );
}
