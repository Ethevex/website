import Image from "next/image";

import { ThemeToggle } from "@/components/theme-toggle";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-6 py-24 sm:px-10">
      <div className="absolute top-6 right-6 z-10 sm:top-8 sm:right-8">
        <ThemeToggle />
      </div>
      <div className="relative z-10 flex w-full flex-col items-center text-center">
        <div className="relative isolate flex w-full max-w-md flex-col items-center">
          <div
            className="pointer-events-none absolute -top-12 -inset-x-6 bottom-0 -z-10 sm:-inset-x-12"
            aria-hidden="true"
          >
            <DottedGlowBackground
              className="mask-radial-to-90% mask-radial-at-center"
              opacity={1}
              gap={10}
              radius={1.6}
              colorLightVar="--color-neutral-500"
              glowColorLightVar="--color-neutral-600"
              colorDarkVar="--color-neutral-500"
              glowColorDarkVar="--color-sky-800"
              backgroundOpacity={0}
              speedMin={0.3}
              speedMax={1.6}
              speedScale={1}
            />
          </div>
          <div className="relative size-48 shrink-0 sm:size-56">
            <Image
              src="/ethevex-clean.svg"
              alt="Ethevex logo"
              width={224}
              height={224}
              preload
              className="size-full dark:hidden"
            />
            <Image
              src="/ethevex-dark-clean.svg"
              alt="Ethevex logo"
              width={224}
              height={224}
              loading="eager"
              className="hidden size-full dark:block"
            />
          </div>

          <h1 className="text-5xl leading-none font-medium tracking-[-0.06em] sm:text-6xl md:text-7xl">
            Ethevex
          </h1>
          <p className="mt-3 text-sm leading-relaxed tracking-wide">
            <span className="sr-only">Pronounced </span>
            ETH-ee-weks
          </p>
        </div>
        <p className="mt-5 max-w-full text-base leading-relaxed tracking-[-0.02em] sm:text-lg">
          A domain that encompasses all
        </p>
      </div>
    </main>
  );
}
