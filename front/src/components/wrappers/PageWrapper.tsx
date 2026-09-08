import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "../../utils/cn";

type PageWrapperProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

/** Uniform layout for pages built around the shared Header component. */
export default function PageWrapper<T extends ElementType = "div">({
  as,
  className = "",
  ...props
}: PageWrapperProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    />
  );
}
