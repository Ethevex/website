import About from "@/components/about/about";
import { HomeHero } from "@/components/home/home-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="relative px-6 sm:px-12 lg:px-20">
      <div className="absolute top-6 right-6 z-10 sm:top-8 sm:right-12 lg:right-20">
        <ThemeToggle />
      </div>
      <main className="mx-auto w-full max-w-6xl">
        <HomeHero />
        <About />
      </main>
      <SiteFooter />
    </div>
  );
}
