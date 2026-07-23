import { PropsWithChildren, useEffect, useRef, useState } from "react";

/**
 * Enables horizontal scrolling only when content exceeds the available width.
 * The tolerance absorbs sub-pixel rounding from tables and browser zoom.
 */
export default function TableOverflowContainer({
  children,
}: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateOverflow = () => {
      setHasOverflow(container.scrollWidth - container.clientWidth > 4);
    };

    updateOverflow();
    const observer = new ResizeObserver(updateOverflow);
    observer.observe(container);
    const child = container.firstElementChild;
    if (child) observer.observe(child);

    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      ref={containerRef}
      className={`w-full min-w-0 max-w-full ${
        hasOverflow ? "overflow-x-auto" : "overflow-x-clip"
      }`}
    >
      {children}
    </div>
  );
}
