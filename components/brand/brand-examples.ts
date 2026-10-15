import type { EthevexAttributionProps } from "./attribution/ethevex-attribution";

export type PreviewOptions = {
  variant: NonNullable<EthevexAttributionProps["variant"]>;
  size: NonNullable<EthevexAttributionProps["size"]>;
  surface: "light" | "dark";
};

export function exampleKey({ variant, size, surface }: PreviewOptions) {
  return `${variant}-${size}-${surface}`;
}

export function htmlExample(source: string, { variant, size, surface }: PreviewOptions) {
  return source
    .replace('data-ethevex-variant="inline"', `data-ethevex-variant="${variant}"`)
    .replace('data-ethevex-size="regular"', `data-ethevex-size="${size}"`)
    .replace("background: #ffffff; color: #000000;", surface === "dark"
      ? "background: #000000; color: #ffffff;"
      : "background: #ffffff; color: #000000;");
}

export function reactExample({ variant, size, surface }: PreviewOptions) {
  return `import { EthevexAttribution } from "./ethevex-attribution";

export function ProjectFooter() {
  return (
    <footer style={{ background: "${surface === "light" ? "#ffffff" : "#000000"}", color: "${surface === "light" ? "#000000" : "#ffffff"}", padding: "24px" }}>
      <EthevexAttribution
        variant="${variant}"
        size="${size}"
        appearance="inherit"
      />
    </footer>
  );
}
`;
}

export function htmlPreviewDocument(html: string, css: string) {
  // Only maintained local source enters this script-free, isolated preview.
  return html.replace(
    '<link rel="stylesheet" href="./ethevex-attribution.css">',
    `<base target="_top"><style>${css}\nbody { box-sizing: border-box; min-height: 100svh; display: grid; place-items: center; }</style>`,
  );
}
