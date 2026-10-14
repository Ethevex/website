import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

// Test the actual controller with a deterministic scheduler/device double.
// GPU pixel checks live in check-glass-logo.mjs.
const source = await readFile(new URL("../components/home/glass-logo/glass-logo-renderer.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2022 },
}).outputText
  .replace(/import \{[^}]+\} from "vgpu";/, "const { effect, frame, init, surface } = globalThis.__glassTestGpu;")
  .replace(/import glassShader from "\.\/glass-logo.wgsl";/, "const glassShader = {};");

function events(extra = {}) {
  const listeners = new Map();
  return {
    ...extra, listeners,
    addEventListener(name, fn) { listeners.set(name, fn); },
    removeEventListener(name) { listeners.delete(name); },
    dispatch(name, payload = {}) { listeners.get(name)?.(payload); },
  };
}

let serial = 0;
async function harness({ delayInit = false } = {}) {
  const pending = new Map();
  let frameId = 0, now = 0, dark = false;
  const status = [], rendered = [], observations = [];
  const media = [events({ matches: false }), events({ matches: true })];
  const root = events({ getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 }) });
  const win = events({ matchMedia: (query) => query.includes("reduced") ? media[0] : media[1] });
  const doc = events({ hidden: false, documentElement: { classList: { contains: () => dark } } });
  const observers = [];
  class Observer {
    constructor(callback) { this.callback = callback; this.disconnected = false; observers.push(this); }
    observe() {}
    disconnect() { this.disconnected = true; }
  }
  Object.assign(globalThis, {
    window: win, document: doc,
    requestAnimationFrame: (fn) => { pending.set(++frameId, fn); return frameId; },
    cancelAnimationFrame: (id) => pending.delete(id),
    ResizeObserver: Observer, MutationObserver: Observer, IntersectionObserver: Observer,
  });
  let lost;
  const context = {
    gpu: { lost: new Promise((resolve) => { lost = resolve; }), queue: { onSubmittedWorkDone: async () => {} } },
    dispose() { this.disposed = true; },
    onError() { return () => {}; },
    settled: async () => {},
  };
  const target = { size: [600, 520], dispose() { this.disposed = true; } };
  let initialize;
  const initialization = new Promise((resolve) => { initialize = () => resolve(context); });
  globalThis.__glassTestGpu = {
    init: () => delayInit ? initialization : Promise.resolve(context),
    surface: () => target,
    effect: () => ({
      compile: () => { throw new Error("Surface pre-warming must not block startup"); },
      set: (values) => observations.push(structuredClone(values)),
    }),
    frame: (_, callback) => callback({ pass: () => rendered.push(now) }),
  };
  const rendererModule = await import(`data:text/javascript;base64,${Buffer.from(`${compiled}\n// instance ${serial++}`).toString("base64")}`);
  const dispose = rendererModule.startGlassLogo({}, root, (ready) => status.push(ready));
  const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  await flush();
  const settle = () => {
    let ticks = 0;
    while (pending.size && ticks++ < 200) {
      now += 16;
      const callbacks = [...pending.values()]; pending.clear(); callbacks.forEach((fn) => fn(now));
    }
    assert.equal(pending.size, 0, "Rendering must stop when the light settles");
  };
  return { context, target, dispose, status, root, win, doc, media, observers, pending, rendered, observations, settle, flush, initialize, lost, setDark: () => { dark = true; } };
}

test("pointer settling, touch/reduced motion, theme changes and cleanup", async () => {
  const h = await harness();
  assert.deepEqual(h.status, [true]);
  h.settle();
  h.root.dispatch("pointermove", { pointerType: "mouse", clientX: 90, clientY: 20 });
  h.settle();
  assert.ok(h.observations.at(-1).scene.pointer[0] > 0.79);
  assert.ok(h.observations.at(-1).scene.pointer[1] < -0.59);
  h.root.dispatch("pointerleave"); h.settle();
  assert.ok(Math.abs(h.observations.at(-1).scene.pointer[0]) < 0.001);
  h.media[0].matches = true; h.media[0].dispatch("change"); h.settle();
  const count = h.rendered.length;
  h.root.dispatch("pointermove", { pointerType: "mouse", clientX: 90, clientY: 20 });
  h.root.dispatch("pointermove", { pointerType: "touch", clientX: 90, clientY: 20 });
  assert.equal(h.pending.size, 0);
  assert.equal(h.rendered.length, count);
  h.setDark(); h.observers[1].callback();
  assert.equal(h.observations.at(-1).scene.dark, 1);
  h.dispose();
  assert.ok(h.context.disposed && h.target.disposed);
  assert.ok(h.observers.every((observer) => observer.disconnected));
  assert.equal(h.root.listeners.size, 0);
  assert.equal(h.win.listeners.size, 0);
  assert.equal(h.doc.listeners.size, 0);
});

test("unmount before async initialization releases the late device", async () => {
  const h = await harness({ delayInit: true });
  h.dispose(); h.initialize(); await h.flush();
  assert.ok(h.context.disposed);
  assert.equal(h.rendered.length, 0);
  assert.deepEqual(h.status, []);
});

test("device loss restores fallback and releases observers/listeners", async () => {
  const h = await harness();
  const warning = console.warn;
  console.warn = () => {};
  try {
    h.lost({ message: "test loss" }); await h.flush();
    assert.deepEqual(h.status, [true, false]);
    assert.ok(h.context.disposed && h.target.disposed);
    assert.equal(h.pending.size, 0);
    assert.equal(h.root.listeners.size, 0);
    assert.ok(h.observers.every((observer) => observer.disconnected));
  } finally { console.warn = warning; h.dispose(); }
});

test("installed vGPU rejects Surface pre-warming but supports first-draw compilation", async () => {
  const { init, effect, frame, surface, target } = await import("vgpu/mock");
  const gpu = await init();
  try {
    const backing = target(gpu, { size: [8, 8], format: "rgba8unorm" });
    const context = { configure() {}, unconfigure() {}, getCurrentTexture: () => backing.color.gpu };
    const canvas = { width: 8, height: 8, getContext: () => context };
    const canvasSurface = surface(gpu, canvas, { format: "rgba8unorm", autoResize: false });
    const shader = effect(gpu, "@fragment fn fs_main() -> @location(0) vec4f { return vec4f(1.0); }");
    assert.throws(() => shader.compile(canvasSurface), { code: "VGPU-SURFACE-NOT-IN-FRAME" });
    const errors = [];
    gpu.onError((error) => errors.push(error));
    frame(gpu, (current) => current.pass(canvasSurface, shader));
    await gpu.settled();
    assert.deepEqual(errors, []);
  } finally { gpu.dispose(); }
});
