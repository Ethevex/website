import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife } from "next/cache";
import { highlightBrandSources } from "./brand-highlighting";

export async function getBrandSources() {
  "use cache";
  cacheLife("max");
  const [react, html, css] = await Promise.all([
    readFile(path.join(process.cwd(), "components/brand/attribution/ethevex-attribution.tsx"), "utf8"),
    readFile(path.join(process.cwd(), "components/brand/attribution/ethevex-attribution.html"), "utf8"),
    readFile(path.join(process.cwd(), "components/brand/attribution/ethevex-attribution.css"), "utf8"),
  ]);
  const sources = { react, html, css };
  return { ...sources, highlights: await highlightBrandSources(sources) };
}
