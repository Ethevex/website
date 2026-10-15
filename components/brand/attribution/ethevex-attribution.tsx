// Ethevex attribution v1.0.0 — keep this file and its CSS together.
import "./ethevex-attribution.css";

export type EthevexAttributionProps = {
  variant?: "inline" | "outlined";
  size?: "compact" | "regular";
  appearance?: "inherit" | "light" | "dark";
  className?: string;
};

export function EthevexAttribution({
  variant = "inline",
  size = "regular",
  appearance = "inherit",
  className,
}: EthevexAttributionProps) {
  return (
    <a
      href="https://ethevex.com"
      data-ethevex-attribution=""
      data-ethevex-variant={variant}
      data-ethevex-size={size}
      data-ethevex-appearance={appearance}
      className={className}
    >
      <svg
        className="ethevex-attribution__mark"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="238 275 547.5 472.5"
        width="20"
        height="17.26"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
      >
        <path d="m 785.37,746.2 c -0.59,0.96 -545.75,1.09 -546.7,0.13 C 238.3,745.97 238,718.74 238,685.83 V 626 h 426.61 l 60.63,59.7 c 33.34,32.84 60.4,60.07 60.13,60.5 z M 680,373.35 664.5,387.93 451.25,387.96 238,388 V 275 l 547.5,0.04 -6.01,5.73 c -3.3,3.15 -23.55,21.99 -45,41.86 -21.44,19.88 -45.96,42.7 -54.49,50.72 z M 477.4,559.25 472.22,564 H 355.78 C 291.73,564 239.03,563.7 238.67,563.33 238.3,562.97 238,537.54 238,506.83 V 451 h 355.47 l -3.49,3.36 c -4.43,4.27 -103.23,96.32 -112.58,104.89 z" />
      </svg>
      <span className="ethevex-attribution__label">
        Part of <span className="ethevex-attribution__name">Ethevex</span>
      </span>
    </a>
  );
}
