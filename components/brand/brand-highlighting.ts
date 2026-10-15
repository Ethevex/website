import "server-only";

import { createHighlighter } from "shiki";
import { exampleKey, htmlExample, reactExample } from "./brand-examples";

type BrandSources = { react: string; html: string; css: string };

export type BrandHighlights = {
  react: string;
  css: string;
  examples: Record<string, { react: string; html: string }>;
};

let highlighter: ReturnType<typeof createHighlighter> | undefined;

export async function highlightBrandSources(sources: BrandSources): Promise<BrandHighlights> {
  // Reuse one server-side engine and load only the three languages we display.
  highlighter ??= createHighlighter({
    langs: ["tsx", "html", "css"],
    themes: ["github-light", "github-dark"],
  });
  const engine = await highlighter;

  function highlight(source: string, lang: "tsx" | "html" | "css", filename: string) {
    return engine.codeToHtml(source, {
      lang,
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
      transformers: [{
        pre(node) {
          node.properties.tabIndex = 0;
          node.properties["aria-label"] = `${filename} source code`;
        },
      }],
    });
  }

  const examples: BrandHighlights["examples"] = {};
  // The playground has just eight source configurations. Pre-highlight them
  // together so changing controls needs no network call or client highlighter.
  for (const variant of ["inline", "outlined"] as const) {
    for (const size of ["compact", "regular"] as const) {
      for (const surface of ["light", "dark"] as const) {
        const options = { variant, size, surface };
        examples[exampleKey(options)] = {
          react: highlight(reactExample(options), "tsx", "project-footer.tsx"),
          html: highlight(htmlExample(sources.html, options), "html", "ethevex-attribution.html"),
        };
      }
    }
  }

  return {
    react: highlight(sources.react, "tsx", "ethevex-attribution.tsx"),
    css: highlight(sources.css, "css", "ethevex-attribution.css"),
    examples,
  };
}
