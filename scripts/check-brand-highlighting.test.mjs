import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const read = (filename) => readFile(new URL(`../${filename}`, import.meta.url), "utf8");
const [react, html, css, examplesSource, highlighterSource] = await Promise.all([
  read("components/brand/attribution/ethevex-attribution.tsx"),
  read("components/brand/attribution/ethevex-attribution.html"),
  read("components/brand/attribution/ethevex-attribution.css"),
  read("components/brand/brand-examples.ts"),
  read("components/brand/brand-highlighting.ts"),
]);
const compile = (source) => ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
const examplesUrl = moduleUrl(compile(examplesSource));
// Execute the shipped highlighter in Node; the server-only guard is enforced by Next.
assert.match(highlighterSource, /import "server-only"/);
const highlighterUrl = moduleUrl(compile(highlighterSource)
  .replace('import "server-only";', "")
  .replace('from "shiki"', `from ${JSON.stringify(import.meta.resolve("shiki"))}`)
  .replace('from "./brand-examples"', `from ${JSON.stringify(examplesUrl)}`));
const { highlightBrandSources } = await import(highlighterUrl);
const { exampleKey, htmlExample, reactExample } = await import(examplesUrl);
const sources = { react, html, css };
const before = structuredClone(sources);
const highlights = await highlightBrandSources(sources);

function textContent(markup) {
  return markup.replace(/<[^>]*>/g, "").replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity) => {
    if (entity.startsWith("#x")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
    if (entity.startsWith("#")) return String.fromCodePoint(parseInt(entity.slice(1), 10));
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[entity];
  });
}

function verify(markup, original, filename) {
  assert.equal(textContent(markup), original, "Highlighted text must preserve source including whitespace");
  assert.match(markup, /<pre\b/);
  assert.match(markup, /<code>/);
  assert.match(markup, /tabindex="0"/);
  assert.ok(markup.includes(`aria-label="${filename} source code"`));
  assert.match(markup, /--shiki-light:/);
  assert.match(markup, /--shiki-dark:/);
  assert.doesNotMatch(markup, /<script\b|<iframe\b|<svg\b|<link\b/i, "Source markup must remain escaped code");
}

test("static TSX and CSS retain exact text and both accessible theme palettes", () => {
  verify(highlights.react, react, "ethevex-attribution.tsx");
  verify(highlights.css, css, "ethevex-attribution.css");
  assert.deepEqual(sources, before, "Copy/download sources must remain untouched");
});

test("all eight configurations have matching highlighted React and HTML examples", () => {
  assert.equal(Object.keys(highlights.examples).length, 8);
  for (const variant of ["inline", "outlined"]) {
    for (const size of ["compact", "regular"]) {
      for (const surface of ["light", "dark"]) {
        const options = { variant, size, surface };
        const result = highlights.examples[exampleKey(options)];
        verify(result.react, reactExample(options), "project-footer.tsx");
        verify(result.html, htmlExample(html, options), "ethevex-attribution.html");
      }
    }
  }
});

test("HTML-like strings cannot become executable markup in the code panel", async () => {
  const hostile = 'const example = "</code></pre><script>alert(1)</script><img src=x onerror=alert(2)> &";\n';
  const result = await highlightBrandSources({ ...sources, react: hostile });
  assert.equal(textContent(result.react), hostile);
  assert.doesNotMatch(result.react, /<script\b|<img\b|<\/code><\/pre><script/i);
});

test("client panels have no runtime import of Shiki or the server highlighter", async () => {
  for (const file of ["brand-playground.tsx", "source-panel.tsx", "brand-examples.ts"]) {
    const compiled = compile(await read(`components/brand/${file}`));
    assert.doesNotMatch(compiled, /(?:from\s*|import\s*\()["'][^"']*(?:shiki|brand-highlighting)/);
  }
});
