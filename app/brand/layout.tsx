import { BrandNavbar } from "@/components/brand/brand-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import "./brand.css";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-brand-page className="brand-page">
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
