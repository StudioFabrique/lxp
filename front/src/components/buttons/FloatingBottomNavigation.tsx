import { type ReactNode, useEffect, useRef, useState } from "react";

type Props = {
  startActions?: ReactNode;
  endActions?: ReactNode;
};

const FloatingBottomNavigation = ({ startActions, endActions }: Props) => {
  const [isFloating, setIsFloating] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFloating(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className={`sticky bottom-4 z-30 mt-12 w-full p-4 rounded-2xl flex justify-between items-center border transition-all duration-500 ease-in-out ${
          isFloating
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
