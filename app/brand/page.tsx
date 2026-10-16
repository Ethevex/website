import type { Metadata } from "next";
import Image from "next/image";
import { ArrowDown } from "lucide-react";

import { BrandPlayground } from "@/components/brand/brand-playground";
import { getBrandSources } from "@/components/brand/brand-sources";
import { BrandTypography } from "@/components/brand/brand-typography";

export const metadata: Metadata = {
  title: "Brand — Ethevex",
  description: "Ethevex attribution components, approved logo assets, typography, and guidance for projects that are part of Ethevex.",
};

const assets = [
  { name: "Black monogram", description: "For light surfaces", src: "/ethevex-clean.svg", background: "#ffffff" },
  { name: "White monogram", description: "For dark surfaces", src: "/ethevex-dark-clean.svg", background: "#000000" },
];

const guidelines = [
  {
    title: "A shared identity",
    description: "Use “Part of Ethevex” on projects belonging to the Ethevex umbrella. It expresses affiliation; it is not an ownership verification mark. Public access to these files does not establish affiliation or invite unrelated projects to claim it.",
  },
  {
    title: "Let the project lead",
    description: "Keep each project’s own identity primary. Place the attribution in a footer, About section, or sidebar, with enough surrounding space to remain distinct from nearby content. The component does not position itself.",
  },
  {
    title: "Preserve the signature",
    description: "Keep the approved monogram, its proportions, and the wording intact. Use the inline or outlined presentation with sharp corners. Choose compact or regular sizing to suit the surrounding content; avoid stretching or cropping the mark.",
  },
  {
    title: "Match the surface",
    description: "Use black on light surfaces and white on dark surfaces. The default appearance inherits the host’s text color and font. Ensure readable contrast, keep the keyboard focus outline visible, and allow the label to wrap when space or enlarged text requires it.",
  },
  {
    title: "Keep it local",
    description: "The attribution is an ordinary link with a local SVG and scoped CSS. It introduces no tracking, remote assets, font downloads, or JavaScript requirement for basic display. It does not manage your site’s theme.",
  },
  {
    title: "Update deliberately",
    description: "This is attribution release v1.0.0, separate from the website’s version. Keep the source and CSS from the same release together. Copied integrations only change when you update them; changes to this page do not remotely update your projects.",
  },
];

export default async function BrandPage() {
  const sources = await getBrandSources();

  return (
    <>
      <div className="py-16 lg:py-24">
        <p className="mb-5 text-sm text-foreground/65">The Ethevex identity</p>
        <h1 className="text-6xl leading-none font-medium tracking-[-0.045em] sm:text-7xl lg:text-8xl">Brand</h1>
        <p className="mt-8 max-w-[54ch] text-xl leading-relaxed tracking-[-0.02em] sm:text-2xl">A shared signature for the sites, tools, and projects that are part of Ethevex.</p>
        <p className="mt-5 max-w-[65ch] text-base leading-7 text-foreground/70">Use the attribution components and approved assets below to connect your project to Ethevex while keeping its own identity at the center.</p>
      </div>

      <section id="components" tabIndex={-1} aria-labelledby="components-heading" className="min-w-0 border-t border-foreground/15 py-12 focus:outline-none sm:py-16">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="components-heading" className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Components</h2>
          <span className="text-sm text-foreground/65">Attribution v1.0.0</span>
        </div>
        <p className="mb-8 max-w-[65ch] text-base leading-7 text-foreground/75">One signature, two presentations. Choose the version that fits your project, then copy the source and shared styles. Both link directly to Ethevex.</p>
        <BrandPlayground sources={sources} />
      </section>

      <section id="assets" tabIndex={-1} aria-labelledby="assets-heading" className="border-t border-foreground/15 py-12 focus:outline-none sm:py-16">
        <h2 id="assets-heading" className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Assets</h2>
        <p className="mt-5 max-w-[65ch] text-base leading-7 text-foreground/75">The approved Balanced Three Blades E monogram. These SVG downloads preserve the original artwork, proportions, and canvas whitespace.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {assets.map((asset) => (
            <div key={asset.src} className="min-w-0 border border-foreground/15">
              <div className="flex min-h-56 items-center justify-center" style={{ background: asset.background }}>
                <Image src={asset.src} alt={asset.name} width={224} height={224} className="h-auto w-56 max-w-full" />
              </div>
              <div className="border-t border-foreground/15 p-5">
                <h3 className="text-lg font-medium">{asset.name}</h3>
                <p className="mt-1 text-sm text-foreground/65">{asset.description}</p>
                <a href={asset.src} download className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
                  Download SVG<span className="sr-only"> — {asset.name}</span>
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BrandTypography />

      <section id="guidelines" tabIndex={-1} aria-labelledby="guidelines-heading" className="border-t border-foreground/15 pt-12 focus:outline-none sm:pt-16">
        <h2 id="guidelines-heading" className="text-3xl font-medium tracking-[-0.035em] sm:text-4xl">Guidelines</h2>
        <div className="mt-10 grid gap-x-16 gap-y-10 md:grid-cols-2">
          {guidelines.map(({ title, description }) => (
            <div key={title}>
              <h3 className="text-lg font-medium tracking-tight">{title}</h3>
              <p className="mt-3 max-w-[62ch] text-base leading-7 text-foreground/75">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
