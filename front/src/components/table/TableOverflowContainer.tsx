import { PropsWithChildren } from "react";

/**
 * Enables horizontal scrolling only when content exceeds the available width.
 * Also acts as the container for responsive column visibility (`@container`).
 */
export default function TableOverflowContainer({
  children,
}: PropsWithChildren) {
  return (
    <div className="@container w-full min-w-0 max-w-full overflow-x-auto">{children}</div>
  );
}
