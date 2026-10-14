import { GlassLogo } from "@/components/home/glass-logo/glass-logo";

export function HomeHero() {
  return (
    <section
      aria-labelledby="home-heading"
      className="relative isolate flex items-center py-24 text-left lg:min-h-[78svh]"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-12">
        <div className="relative aspect-15/13 w-72 max-w-full sm:w-90 lg:order-2 lg:w-[calc(100%+3rem)] lg:max-w-none xl:w-[calc(100%+4rem)]">
          <GlassLogo />
        </div>
        <div className="min-w-0 lg:order-1">
          <h1
            id="home-heading"
            className="text-[min(clamp(3.75rem,10vw,9rem),19vw)] leading-[0.95] font-medium tracking-[-0.045em] whitespace-nowrap"
          >
            Ethevex
          </h1>
          <div>
            <p className="mt-2 text-[0.9375rem] leading-relaxed tracking-wide">
              <span className="sr-only">Pronounced </span>
              ETH-ee-weks
            </p>
            <p className="mt-6 max-w-full text-[1.375rem] leading-relaxed tracking-[-0.02em] sm:text-[1.625rem]">
              A domain that encompasses all
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
