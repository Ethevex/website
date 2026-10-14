import Image from "next/image";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  variant?: "default" | "sculptural";
};

export function BrandLogo({ className, variant = "default" }: BrandLogoProps) {
  const sculptural = variant === "sculptural";
  // Both approved SVGs share a 1024px canvas. Fit their visible blades
  // (x=238, y=275, width=547.5, height<472.5) without modifying the assets.
  const imageStyle = sculptural
    ? {
        width: `${(1024 / 547.5) * 100}%`,
        left: `${(-238 / 547.5) * 100}%`,
        top: `${(-275 / 472.5) * 100}%`,
      }
    : undefined;
  const imageClassName = sculptural
    ? "absolute h-auto max-w-none"
    : "size-full";

  return (
    <div
      className={cn(
        "relative shrink-0",
        sculptural
          ? "aspect-[547.5/472.5] w-30 overflow-hidden"
          : "size-48 sm:size-56",
        className,
      )}
    >
      <Image
        src="/ethevex-clean.svg"
        alt="Ethevex logo"
        width={224}
        height={224}
        preload
        className={cn(imageClassName, "dark:hidden")}
        style={imageStyle}
      />
      <Image
        src="/ethevex-dark-clean.svg"
        alt="Ethevex logo"
        width={224}
        height={224}
        loading="eager"
        className={cn(imageClassName, "hidden dark:block")}
        style={imageStyle}
      />
    </div>
  );
}
