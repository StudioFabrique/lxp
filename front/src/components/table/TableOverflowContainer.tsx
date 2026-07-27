import { PropsWithChildren } from "react";

/**
 * Enables horizontal scrolling only when content exceeds the available width.
 */
export default function TableOverflowContainer({
  children,
}: PropsWithChildren) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-auto">{children}</div>
  );
}
