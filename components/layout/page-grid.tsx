import type { ReactNode } from "react";

export function PageGrid({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-[calc(100%-2rem)] max-w-6xl sm:w-[calc(100%-5rem)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 border-l border-l-foreground/20 border-r border-r-foreground/10"
      >
        <span className="absolute -top-px -left-px h-16 border-l border-foreground/70" />
        <span className="absolute -right-px -bottom-px h-16 border-r border-foreground/70" />
      </div>
      {children}
    </div>
  );
}

type GridDividerProps = {
  position?: "start" | "section" | "end";
};

export function GridDivider({ position = "section" }: GridDividerProps) {
  const isSection = position === "section";

  return (
    <div aria-hidden="true" className="pointer-events-none relative z-20 h-0">
      <div
        className={`absolute top-0 -inset-x-4 border-t sm:-inset-x-8 ${
          isSection
            ? "border-dashed border-foreground/20"
            : "border-foreground/15"
        }`}
      />

      {isSection && (
        <div className="absolute top-0 left-1/2 flex h-5 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1.5 bg-background">
          <span className="h-2 w-px -rotate-45 bg-foreground/30" />
          <span className="h-3 w-px -rotate-45 bg-foreground/70" />
          <span className="h-2 w-px -rotate-45 bg-foreground/30" />
        </div>
      )}

      {(["left", "right"] as const).map((side) => {
        const upperRotation = side === "left" ? 270 : 180;
        const lowerRotation = side === "left" ? 0 : 90;
        const rotations =
          position === "start"
            ? [lowerRotation]
            : position === "end"
              ? [upperRotation]
              : [upperRotation, lowerRotation];

        return (
          <svg
            key={side}
            viewBox="-16 -16 32 32"
            fill="currentColor"
            focusable="false"
            className={`absolute top-0 size-8 -translate-x-1/2 -translate-y-1/2 text-foreground/65 ${
              side === "left" ? "left-0" : "left-full"
            }`}
          >
            {rotations.map((rotation) => (
              <path
                key={rotation}
                d="M 0 10 A 10 10 0 0 1 10 0 H 0 Z"
                transform={`rotate(${rotation})`}
              />
            ))}
          </svg>
        );
      })}
    </div>
  );
}
