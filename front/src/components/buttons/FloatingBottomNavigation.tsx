import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  startActions?: ReactNode;
  endActions?: ReactNode;
  stickyActivationOffset?: number;
};

const FloatingBottomNavigation = ({
  startActions,
  endActions,
  stickyActivationOffset = 0,
}: Props) => {
  const activationOffset = Number.isFinite(stickyActivationOffset)
    ? Math.max(0, stickyActivationOffset)
    : 0;
  const [isDocked, setIsDocked] = useState(false);
  const [isDelayedStickyActive, setIsDelayedStickyActive] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isSticky = activationOffset === 0 || isDelayedStickyActive;

  useEffect(() => {
    const scrollRoot = sentinelRef.current?.closest(
      "#main-scroll-container",
    );
    const dockingObserver = new IntersectionObserver(
      ([entry]) => {
        setIsDocked(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsDelayedStickyActive(false);
        }
      },
      {
        root: scrollRoot,
        threshold: 0.1,
      },
    );

    if (sentinelRef.current) {
      dockingObserver.observe(sentinelRef.current);
    }

    return () => dockingObserver.disconnect();
  }, []);

  useEffect(() => {
    if (activationOffset === 0) return;

    const scrollRoot = sentinelRef.current?.closest(
      "#main-scroll-container",
    );
    const activationObserver = new IntersectionObserver(
      ([entry]) => {
        setIsDelayedStickyActive(!entry.isIntersecting);
      },
      {
        root: scrollRoot,
        rootMargin: `0px 0px ${activationOffset}px 0px`,
        threshold: 0.1,
      },
    );

    if (sentinelRef.current) {
      activationObserver.observe(sentinelRef.current);
    }

    return () => activationObserver.disconnect();
  }, [activationOffset]);

  return (
    <>
      <div
        className={`${isSticky ? "sticky bottom-4" : ""} z-30 mt-12 w-full p-4 rounded-2xl flex justify-between items-center border transition-all duration-500 ease-in-out ${
          isDocked
            ? "bg-transparent backdrop-blur-none border-transparent shadow-none"
            : "bg-base-200/90 backdrop-blur border-base-300 shadow-xl"
        }`}
      >
        <div className="flex items-center gap-4">{startActions}</div>
        <div className="flex items-center gap-4">{endActions}</div>
      </div>

      <div ref={sentinelRef} className="h-px w-full" />
    </>
  );
};

export default FloatingBottomNavigation;
