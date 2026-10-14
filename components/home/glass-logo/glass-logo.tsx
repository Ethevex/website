"use client";

import { useEffect, useRef, useState } from "react";

import { BrandLogo } from "@/components/brand-logo";

export function GlassLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.closest("section");
    if (!canvas || !hero || !navigator.gpu) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;
    // Keep the server-rendered SVG/text independent of the optional GPU bundle.
    void import("./glass-logo-renderer")
      .then(({ startGlassLogo }) => {
        if (cancelled) return;
        dispose = startGlassLogo(canvas, hero, (presented) => {
          if (!cancelled) setReady(presented);
        });
      })
      .catch((error: unknown) => {
        if (process.env.NODE_ENV !== "production")
          console.warn("Ethevex glass could not load:", error);
      });
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      data-glass-status={ready ? "ready" : "fallback"}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div
        className="absolute aspect-15/13 h-full w-auto max-w-full"
        hidden={ready}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.12] dark:opacity-[0.18]">
          <BrandLogo variant="sculptural" className="w-5/6" />
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}
