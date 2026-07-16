import { HTMLProps, forwardRef } from "react";
import { cn } from "../../../../utils/cn";

export type SurfaceProps = HTMLProps<HTMLDivElement> & {
  withShadow?: boolean;
  withBorder?: boolean;
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  (
    { children, className, withShadow = true, withBorder = true, ...props },
    ref,
  ) => {
    const surfaceClass = cn(
      className,
      "text-base rounded-xl z-50",
      withShadow ? "shadow-lg shadow-base-content/5" : "",
      withBorder ? "border border-base-300" : "",
    );

    return (
      <div className={surfaceClass} {...props} ref={ref}>
        {children}
      </div>
    );
  },
);

Surface.displayName = "Surface";
