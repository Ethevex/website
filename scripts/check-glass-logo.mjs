import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { resolveShader } from "@vgpu/wgsl/runtime";
import { effect, init, target } from "vgpu/node";
import { outlineFromSvg, shaderForOutline } from "./generate-glass-outline.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "components/home/glass-logo");
const output = process.argv[2] ?? "/tmp/ethevex-glass-check";
await mkdir(output, { recursive: true });
const svg = await readFile(path.join(root, "public/ethevex-clean.svg"), "utf8");
assert.equal(await readFile(path.join(directory, "logo-outline.wgsl"), "utf8"), shaderForOutline(outlineFromSvg(svg)), "Generated outline must match the source asset");
const resolved = await resolveShader({ entry: path.join(directory, "glass-logo.wgsl"), minify: true, validate: true });
assert.equal(resolved.validation.ok, true, "WGSL must validate on a real device");
const gpu = await init();
const errors = [];
gpu.onError((error) => errors.push(error));
const report = { checks: [], renders: [] };

try {
  // Extract Fresnel, normal and Snell refraction values from the actual shipped
  // helpers, then compare to an independent CPU reference at rgba8 precision.
  const optics = (await readFile(path.join(directory, "glass-optics.wgsl"), "utf8")).replace(/\bexport\s+/g, "");
  const probes = target(gpu, { size: [5, 1], format: "rgba8unorm" });
  const probeShader = effect(gpu, `${optics}
    @fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
      let slot = i32(floor(uv.x * 5.0));
      if (slot == 0) { return vec4f(glass_fresnel(0.2), glass_fresnel(0.5), glass_fresnel(1.0), 1.0); }
      if (slot == 1) { return vec4f(glass_normal(vec3f(-0.025, 1.0, 0.0)) * 0.5 + 0.5, 1.0); }
      if (slot == 3) { return vec4f(glass_incident(vec2f(0.8, -0.65)) * 0.5 + 0.5, 1.0); }
      if (slot == 4) { return vec4f(glass_incident(vec2f(0.0)) * 0.5 + 0.5, 1.0); }
      let ray = refract(vec3f(0.0, 0.0, -1.0), normalize(vec3f(1.0, 0.0, 1.0)), 1.0 / GLASS_IOR);
      return vec4f(ray * 0.5 + 0.5, 1.0);
    }`);
  probeShader.draw(probes);
  const values = await probes.color.read({ mipLevel: 0, region: "all" });
  const slope = 4.5 * 0.5 ** 1.2;
  const length = Math.hypot(slope, 1);
  const eta = 1 / 1.8, dot = -Math.SQRT1_2;
  const f0 = ((1.8 - 1) / (1.8 + 1)) ** 2;
  const incident = [-0.8 * 0.38, 0.65 * 0.38, -1];
  const incidentLength = Math.hypot(...incident);
  const factor = eta * dot + Math.sqrt(1 - eta ** 2 * (1 - dot ** 2));
  const reference = [
    f0 + (1 - f0) * 0.8 ** 5, f0 + (1 - f0) * 0.5 ** 5, f0, 1,
    slope / length * 0.5 + 0.5, 0.5, 1 / length * 0.5 + 0.5, 1,
    -factor * Math.SQRT1_2 * 0.5 + 0.5, 0.5, (-eta - factor * Math.SQRT1_2) * 0.5 + 0.5, 1,
    ...incident.map((value) => value / incidentLength * 0.5 + 0.5), 1,
    0.5, 0.5, 0, 1,
  ];
  const maxError = Math.max(...reference.map((value, i) => Math.abs(value - values[i] / 255)));
  assert.ok(maxError < 2 / 255, `Optics extraction error: ${maxError}`);
  report.checks.push({ opticsMaxError: maxError, tolerance: 2 / 255 });

  for (const [width, height] of [[312, 320], [672, 448], [864, 384], [1152, 576]]) {
    const color = target(gpu, { size: [width, height], format: "rgba8unorm" });
    const scene = { resolution: [width, height], pointer: [0, 0], dark: 0 };
    const glass = effect(gpu, resolved.wgsl, { set: { scene } });
    await glass.compile(color);
    const scale = Math.min(width / 1.2, height / 1.04);
    const viewWidth = width / scale * 547.5, viewHeight = height / scale * 547.5;
    const referenceSvg = svg.replace('width="1024"', `width="${width}"`).replace('height="1024"', `height="${height}"`)
      .replace('viewBox="0 0 1024 1024"', `viewBox="${511.75 - viewWidth / 2} ${511.25 - viewHeight / 2} ${viewWidth} ${viewHeight}"`);
    const mask = await sharp(Buffer.from(referenceSvg)).ensureAlpha().raw().toBuffer();
    for (const dark of [0, 1]) {
      scene.dark = dark;
      scene.pointer = [0, 0];
      glass.set({ scene });
      const start = performance.now();
      glass.draw(color);
      const pixels = await color.color.read({ mipLevel: 0, region: "all" });
      const renderAndReadMs = performance.now() - start;
      let changed = 0, visible = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        assert.equal(pixels[i], pixels[i + 1], "No chromatic dispersion");
        assert.equal(pixels[i], pixels[i + 2], "No chromatic dispersion");
        if ((pixels[i + 3] > 127) !== (mask[i + 3] > 127)) changed++;
        if (pixels[i + 3] > 127) visible++;
      }
      assert.ok(changed / (width * height) < 0.002, "Silhouette differs from the SVG");
      assert.ok(visible / (width * height) > 0.05, "The logo must be visible");
      for (let x = 0; x < width; x++) {
        assert.equal(pixels[x * 4 + 3], 0, "No top clipping");
        assert.equal(pixels[((height - 1) * width + x) * 4 + 3], 0, "No bottom clipping");
      }
      // Flatten premultiplied readback onto the exact page color for inspection.
      const image = Buffer.from(pixels);
      for (let i = 0; i < image.length; i += 4) {
        const background = dark ? 0 : 255 - image[i + 3];
        image[i] += background; image[i + 1] += background; image[i + 2] += background; image[i + 3] = 255;
      }
      const name = `${width}-${dark ? "dark" : "light"}.png`;
      await sharp(image, { raw: { width, height, channels: 4 } }).png().toFile(path.join(output, name));
      report.renders.push({ width, height, dark, silhouetteDisagreement: changed, renderAndReadMs, image: name });
      scene.pointer = [0.8, -0.65];
      glass.set({ scene }); glass.draw(color);
      const moved = await color.color.read({ mipLevel: 0, region: "all" });
      let movedPixels = 0;
      for (let i = 0; i < moved.length; i += 4) {
        assert.equal(moved[i + 3], pixels[i + 3], "Pointer must not move the shape");
        assert.equal(moved[i], moved[i + 1], "Pointer refraction stays monochrome");
        assert.equal(moved[i], moved[i + 2], "Pointer refraction stays monochrome");
        if (Math.abs(moved[i] - pixels[i]) > 2) movedPixels++;
      }
      assert.ok(movedPixels > 100, "Pointer must change lighting");
      glass.draw(color);
      assert.deepEqual(await color.color.read({ mipLevel: 0, region: "all" }), moved, "Fixed inputs must render deterministically");
      const movedImage = Buffer.from(moved);
      for (let i = 0; i < movedImage.length; i += 4) {
        const background = dark ? 0 : 255 - movedImage[i + 3];
        movedImage[i] += background; movedImage[i + 1] += background; movedImage[i + 2] += background; movedImage[i + 3] = 255;
      }
      await sharp(movedImage, { raw: { width, height, channels: 4 } }).png().toFile(path.join(output, name.replace(".png", "-pointer.png")));
      report.checks.push({ width, dark, pointerChangedPixels: movedPixels });
    }
  }
  await gpu.settled();
  assert.deepEqual(errors, [], "No asynchronous GPU errors");
  await writeFile(path.join(output, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ passed: true, output, ...report }, null, 2));
} finally {
  gpu.dispose();
}
