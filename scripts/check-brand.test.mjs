import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import postcss from "postcss";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "components/brand/attribution");
const [react, html, css, original, whiteOriginal] = await Promise.all([
  readFile(path.join(directory, "ethevex-attribution.tsx"), "utf8"),
  readFile(path.join(directory, "ethevex-attribution.html"), "utf8"),
  readFile(path.join(directory, "ethevex-attribution.css"), "utf8"),
  readFile(path.join(root, "public/ethevex-clean.svg"), "utf8"),
  readFile(path.join(root, "public/ethevex-dark-clean.svg"), "utf8"),
]);

function loadTypeScript(source, filename) {
  const { outputText } = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  // Load the exported component without Next.js or a stylesheet loader.
  const localRequire = (name) => name.endsWith(".css") ? {} : require(name);
  new Function("require", "exports", outputText)(localRequire, exports);
  return exports;
}

const { EthevexAttribution } = loadTypeScript(react, "ethevex-attribution.tsx");
const examples = loadTypeScript(await readFile(path.join(root, "components/brand/brand-examples.ts"), "utf8"), "brand-examples.ts");
const logoPath = (source) => source.match(/<path\s+d="([^"]+)"/s)?.[1];
const approvedPath = original.match(/\bd="([^"]+)"/s)[1];

test("both integrations preserve the approved artwork and release revision", () => {
  assert.equal(logoPath(react), approvedPath);
  assert.equal(logoPath(html), approvedPath);
  assert.equal(whiteOriginal.match(/\bd="([^"]+)"/s)[1], approvedPath);
  for (const source of [react, html, css]) assert.match(source, /v1\.0\.0/);
});

test("standalone React renders every public combination without a framework or client hooks", () => {
  for (const variant of ["inline", "outlined"]) {
    for (const size of ["compact", "regular"]) {
      for (const appearance of ["inherit", "light", "dark"]) {
        const result = renderToStaticMarkup(createElement(EthevexAttribution, { variant, size, appearance, className: "host-spacing" }));
        assert.match(result, /href="https:\/\/ethevex.com"/);
        assert.match(result, new RegExp(`data-ethevex-variant="${variant}"`));
        assert.match(result, new RegExp(`data-ethevex-size="${size}"`));
        assert.match(result, new RegExp(`data-ethevex-appearance="${appearance}"`));
        assert.match(result, /class="host-spacing"/);
        assert.match(result, /aria-hidden="true"/);
        assert.match(result, /focusable="false"/);
        assert.equal(logoPath(result), approvedPath);
        assert.equal(result.replace(/<[^>]+>/g, ""), "Part of Ethevex");
        assert.doesNotMatch(result, /<script|<img|\ssrc=|\starget=|\sid=/);
      }
    }
  }
  const defaultMarkup = renderToStaticMarkup(createElement(EthevexAttribution));
  assert.match(defaultMarkup, /data-ethevex-variant="inline"/);
  assert.match(defaultMarkup, /data-ethevex-size="regular"/);
  assert.match(defaultMarkup, /data-ethevex-appearance="inherit"/);
  const multiple = renderToStaticMarkup(createElement("footer", null, createElement(EthevexAttribution), createElement(EthevexAttribution)));
  assert.equal((multiple.match(/data-ethevex-attribution=/g) ?? []).length, 2);
  assert.doesNotMatch(multiple, /\sid=/, "Multiple instances must not duplicate IDs");
  assert.doesNotMatch(react, /next\/|@\/|useEffect|useState|use client|fetch\(|window\.|document\./);
});

test("configured HTML and React examples agree and preserve inherited appearance", () => {
  for (const variant of ["inline", "outlined"]) {
    for (const size of ["compact", "regular"]) {
      for (const surface of ["light", "dark"]) {
        const options = { variant, size, surface };
        const configured = examples.htmlExample(html, options);
        const usage = examples.reactExample(options);
        assert.match(configured, new RegExp(`data-ethevex-variant="${variant}"`));
        assert.match(configured, new RegExp(`data-ethevex-size="${size}"`));
        assert.match(configured, /data-ethevex-appearance="inherit"/);
        assert.equal(logoPath(configured), approvedPath);
        const background = surface === "light" ? "#ffffff" : "#000000";
        assert.ok(configured.includes(`background: ${background};`));
        assert.ok(usage.includes(`background: "${background}"`));
        assert.ok(usage.includes(`variant="${variant}"`));
        assert.ok(usage.includes(`size="${size}"`));
        assert.doesNotMatch(configured, /<script|\ssrc=|\starget=/);
        assert.equal((configured.match(/<a\s/g) ?? []).length, 1);
        const preview = examples.htmlPreviewDocument(configured, css);
        assert.ok(preview.includes(css), "HTML preview must use the downloadable CSS verbatim");
        assert.doesNotMatch(preview, /<link|<script|\ssrc=/, "Preview must not load styles, scripts, or images remotely");
        assert.equal(logoPath(preview), approvedPath);
      }
    }
  }
});

test("portable CSS is scoped, static, theme-independent, and supports text expansion", () => {
  const stylesheet = postcss.parse(css);
  stylesheet.walkRules((rule) => {
    for (const selector of rule.selectors) assert.ok(selector.startsWith("[data-ethevex-attribution]"), selector);
  });
  stylesheet.walkAtRules((rule) => {
    assert.fail(`Portable CSS must not require external assets or a theme query: @${rule.name}`);
  });
  assert.doesNotMatch(css, /url\(|!important|white-space:\s*nowrap|transition:|animation:/);
  const base = stylesheet.nodes.find((node) => node.type === "rule");
  const properties = Object.fromEntries(base.nodes.map(({ prop, value }) => [prop, value]));
  assert.equal(properties.color, "inherit");
  assert.equal(properties["font-family"], "inherit");
  assert.equal(properties["max-width"], "100%");
  assert.equal(properties.height, undefined, "Text must not be constrained by a fixed height");
  assert.match(css, /overflow-wrap:\s*anywhere/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /data-ethevex-appearance="light"\]\s*\{ color: #000000;/);
  assert.match(css, /data-ethevex-appearance="dark"\]\s*\{ color: #ffffff;/);
});
