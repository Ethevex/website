import { effect, frame, init, surface } from "vgpu";
import type { Gpu, Surface } from "vgpu";

import glassShader from "./glass-logo.wgsl";

/** Owns the device, canvas, and listeners. Rendering sleeps when the light settles. */
export function startGlassLogo(
  canvas: HTMLCanvasElement,
  interactionRoot: HTMLElement,
  onReady: (ready: boolean) => void,
): () => void {
  let disposed = false;
  let failed = false;
  let gpu: Gpu | undefined;
  let canvasSurface: Surface | undefined;
  let animation = 0;
  let visible = true;
  let lastFrame = 0;
  let draw: (() => void) | undefined;
  let ready = false;
  const cleanup: (() => void)[] = [];
  const pointer = [0, 0];
  const destination = [0, 0];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  const fail = (error: unknown) => {
    if (disposed || failed) return;
    failed = true;
    cancelAnimationFrame(animation);
    cleanup.forEach((release) => release());
    onReady(false);
    canvasSurface?.dispose();
    gpu?.dispose();
    // Keep a usable SVG on unsupported devices; retain diagnostics for development.
    if (process.env.NODE_ENV !== "production")
      console.warn("Ethevex glass fallback:", error);
  };

  function schedule() {
    if (animation || disposed || failed || !draw || !visible || document.hidden)
      return;
    animation = requestAnimationFrame(render);
  }

  function render(now: number) {
    animation = 0;
    if (disposed || failed || !draw || !visible || document.hidden) return;
    const elapsed = Math.min(64, now - (lastFrame || now - 16));
    lastFrame = now;
    const smoothing = 1 - Math.exp(-elapsed / 100);
    pointer[0] += (destination[0] - pointer[0]) * smoothing;
    pointer[1] += (destination[1] - pointer[1]) * smoothing;
    try {
      draw();
    } catch (error) {
      fail(error);
      return;
    }
    if (
      Math.hypot(destination[0] - pointer[0], destination[1] - pointer[1]) >
      0.001
    )
      schedule();
  }

  function resetPointer() {
    destination[0] = 0;
    destination[1] = 0;
    if (reducedMotion.matches || !finePointer.matches) {
      pointer[0] = 0;
      pointer[1] = 0;
    }
    schedule();
  }

  const onPointerMove = (event: PointerEvent) => {
    if (
      event.pointerType === "touch" ||
      reducedMotion.matches ||
      !finePointer.matches
    )
      return;
    const bounds = interactionRoot.getBoundingClientRect();
    destination[0] = Math.max(
      -1,
      Math.min(1, ((event.clientX - bounds.left) / bounds.width) * 2 - 1),
    );
    destination[1] = Math.max(
      -1,
      Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1),
    );
    schedule();
  };

  void (async () => {
    try {
      gpu = await init({ powerPreference: "low-power" });
      if (disposed) {
        gpu.dispose();
        return;
      }
      cleanup.push(gpu.onError(fail));
      void gpu.gpu.lost.then((info) => {
        if (!disposed && !failed)
          fail(new Error(`WebGPU device lost: ${info.message}`));
      });
      canvasSurface = surface(gpu, canvas, {
        dpr: [1, 1.5],
        alphaMode: "premultiplied",
      });
      const scene = {
        resolution: [...canvasSurface.size],
        pointer,
        dark: document.documentElement.classList.contains("dark") ? 1 : 0,
      };
      const glass = effect(gpu, glassShader, {
        label: "ethevex-optical-glass",
        set: { scene },
      });

      const context = gpu;
      const target = canvasSurface;
      draw = () => {
        frame(context, (current) => {
          scene.resolution[0] = target.size[0];
          scene.resolution[1] = target.size[1];
          scene.dark = document.documentElement.classList.contains("dark")
            ? 1
            : 0;
          glass.set({ scene });
          current.pass({ target, clear: [0, 0, 0, 0] }, glass);
        });
      };
      // vGPU 0.5.0 rejects compile(Surface) outside a frame. Keep compilation
      // on the first draw, and reveal the canvas only after it succeeds.
      draw();
      await context.gpu.queue.onSubmittedWorkDone();
      await context.settled();
      if (disposed || failed) return;
      ready = true;
      onReady(true);

      const resize = new ResizeObserver(schedule);
      resize.observe(canvas);
      cleanup.push(() => resize.disconnect());
      const theme = new MutationObserver(() => {
        // A theme change also repaints when offscreen, preventing stale colors on return.
        if (!disposed && !failed) {
          try {
            draw?.();
          } catch (error) {
            fail(error);
          }
        }
      });
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      cleanup.push(() => theme.disconnect());
      const intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) schedule();
        else {
          cancelAnimationFrame(animation);
          animation = 0;
        }
      });
      intersection.observe(canvas);
      cleanup.push(() => intersection.disconnect());

      interactionRoot.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      interactionRoot.addEventListener("pointerleave", resetPointer);
      reducedMotion.addEventListener("change", resetPointer);
      finePointer.addEventListener("change", resetPointer);
      document.addEventListener("visibilitychange", resetPointer);
      window.addEventListener("resize", schedule);
      cleanup.push(() => {
        interactionRoot.removeEventListener("pointermove", onPointerMove);
        interactionRoot.removeEventListener("pointerleave", resetPointer);
        reducedMotion.removeEventListener("change", resetPointer);
        finePointer.removeEventListener("change", resetPointer);
        document.removeEventListener("visibilitychange", resetPointer);
        window.removeEventListener("resize", schedule);
      });
      // Cover theme/size changes that occurred while the first pipeline compiled.
      schedule();
    } catch (error) {
      fail(error);
    }
  })();

  return () => {
    disposed = true;
    cancelAnimationFrame(animation);
    cleanup.forEach((release) => release());
    canvasSurface?.dispose();
    gpu?.dispose();
    if (ready) onReady(false);
  };
}
