import { PropsWithChildren } from "react";

/**
 * Enables horizontal scrolling only when content exceeds the available width.
 * The tolerance absorbs sub-pixel rounding from tables and browser zoom.
 */
export default function TableOverflowContainer({
  children,
}: PropsWithChildren) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-auto xl:overflow-x-clip">
      {children}
    </div>
  );
}
