import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export function HomeBackground() {
  return (
    <div
      className="pointer-events-none absolute -top-12 -inset-x-6 bottom-0 -z-10 sm:-inset-x-12"
      aria-hidden="true"
    >
      <DottedGlowBackground
        className="mask-radial-to-90% mask-radial-at-center"
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
    </div>
  );
}
