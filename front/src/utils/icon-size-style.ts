import type { CSSProperties } from "react";

/** Preserve Tailwind spacing units without constructing class names. */
export const iconSizeStyle = (size: number): CSSProperties => ({
  width: `calc(var(--spacing, 0.25rem) * ${size})`,
  height: `calc(var(--spacing, 0.25rem) * ${size})`,
});
