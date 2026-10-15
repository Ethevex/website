"use client";

import { useState } from "react";
import { EthevexAttribution } from "./attribution/ethevex-attribution";
import { exampleKey, htmlExample, htmlPreviewDocument, reactExample, type PreviewOptions } from "./brand-examples";
import type { BrandHighlights } from "./brand-highlighting";
import { SourcePanel } from "./source-panel";
import { BrandOptionMenu } from "./brand-option-menu";

type BrandPlaygroundProps = {
  sources: { react: string; html: string; css: string; highlights: BrandHighlights };
};

export function BrandPlayground({ sources }: BrandPlaygroundProps) {
  const [variant, setVariant] = useState<PreviewOptions["variant"]>("inline");
  const [size, setSize] = useState<PreviewOptions["size"]>("regular");
  const [surface, setSurface] = useState<PreviewOptions["surface"]>("light");
  const [integration, setIntegration] = useState<"react" | "html">("react");
  const options = { variant, size, surface };
  const html = htmlExample(sources.html, options);
  const usage = reactExample(options);
  const highlightedExample = sources.highlights.examples[exampleKey(options)];

  return (
    <div className="min-w-0">
      <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 lg:grid-cols-4">
        <BrandOptionMenu label="Presentation" value={variant} onValueChange={setVariant} options={[{ value: "inline", label: "Inline" }, { value: "outlined", label: "Outlined" }]} />
        <BrandOptionMenu label="Size" value={size} onValueChange={setSize} options={[{ value: "compact", label: "Compact" }, { value: "regular", label: "Regular" }]} />
        <BrandOptionMenu label="Preview surface" value={surface} onValueChange={setSurface} options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]} />
        <BrandOptionMenu label="Integration" value={integration} onValueChange={setIntegration} options={[{ value: "react", label: "React" }, { value: "html", label: "HTML" }]} />
      </div>

      <div className="mt-6 border border-foreground/20" aria-label={`${integration === "react" ? "React" : "HTML"} attribution preview on a ${surface} surface`}>
        {integration === "react" ? (
          <div className="flex min-h-60 items-center justify-center p-6" style={{ background: surface === "light" ? "#fff" : "#000", color: surface === "light" ? "#000" : "#fff" }}>
            <EthevexAttribution variant={variant} size={size} />
          </div>
        ) : (
          <iframe title="Standalone HTML attribution preview" sandbox="allow-top-navigation-by-user-activation" srcDoc={htmlPreviewDocument(html, sources.css)} className="block h-60 w-full border-0" />
        )}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/65">The preview surface is independent of the page theme. The signature inherits its surrounding text color.</p>
      <noscript><p className="mt-3 text-sm">Interactive previews and copy/download buttons require JavaScript. Expand the source panels below to select and copy the default examples manually.</p></noscript>

      <div className="mt-10 space-y-4">
        <h3 className="text-xl font-medium tracking-tight">Use in your project</h3>
        {integration === "react" ? (
          <p className="max-w-[65ch] text-sm leading-7 text-foreground/75">Save the TSX and CSS files together. Import the component into your project; it imports its own CSS. For frameworks that require global CSS in an entry file, move that CSS import there. No Next.js or Tailwind setup is required.</p>
        ) : (
          <p className="max-w-[65ch] text-sm leading-7 text-foreground/75">Save the HTML and CSS files together to open the example locally. To integrate it, copy the anchor into your page and load the CSS once. The example page’s background and spacing belong to the host, not the component.</p>
        )}
        <p className="max-w-[65ch] text-sm leading-7 text-foreground/75">Use <code>appearance=&quot;light&quot;</code> for black text or <code>appearance=&quot;dark&quot;</code> for white text when inheritance is unsuitable. In HTML, set <code>data-ethevex-appearance</code>. Neither setting changes the background or the site’s theme.</p>
        <SourcePanel key={`usage-${integration}`} title={integration === "react" ? "React usage example" : "HTML example"} filename={integration === "react" ? "project-footer.tsx" : "ethevex-attribution.html"} source={integration === "react" ? usage : html} highlightedHtml={highlightedExample?.[integration]} open />
        <SourcePanel title="Standalone React component · v1.0.0" filename="ethevex-attribution.tsx" source={sources.react} highlightedHtml={sources.highlights.react} />
        {integration === "react" && <SourcePanel title="Standalone HTML example · v1.0.0" filename="ethevex-attribution.html" source={html} highlightedHtml={highlightedExample?.html} />}
        <SourcePanel title="Shared CSS · v1.0.0" filename="ethevex-attribution.css" source={sources.css} highlightedHtml={sources.highlights.css} />
      </div>
    </div>
  );
}
