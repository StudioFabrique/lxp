import { useEffect, useState } from "react";
import { cn } from "../../utils/cn";

export type LoadingSkeletonProps = {
  variant?: "cards" | "rows" | "detail" | "panel";
  className?: string;
  label?: string;
};

export default function LoadingSkeleton({
  variant = "panel",
  className,
  label = "Chargement du contenu",
}: LoadingSkeletonProps) {
  const [showLoadingMessage, setShowLoadingMessage] = useState(false);

  useEffect(() => {
    if (variant !== "cards" && variant !== "rows") return;
    const timer = window.setTimeout(() => setShowLoadingMessage(true), 400);
    return () => window.clearTimeout(timer);
  }, [variant]);

  if (variant === "cards" || variant === "rows") {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn("flex min-h-16 w-full items-center justify-center", className)}
      >
        <span className="sr-only">{label}…</span>
        {showLoadingMessage && (
          <span className="text-sm text-base-content/60" aria-hidden="true">
            Chargement…
          </span>
        )}
      </div>
    );
  }

  const lines = (
    <>
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-4/5" />
    </>
  );

  return (
    <div role="status" aria-label={label} className={cn("w-full", className)}>
      <span className="sr-only">{label}…</span>
      {variant === "detail" ? (
        <div className="space-y-5" aria-hidden="true">
          <div className="skeleton h-44 w-full rounded-box" />
          <div className="grid gap-5 lg:grid-cols-3">
            <div className="skeleton h-72 rounded-box" />
            <div className="skeleton h-72 rounded-box lg:col-span-2" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 rounded-box border border-base-300 bg-base-100 p-5" aria-hidden="true">
          {lines}
          <div className="skeleton h-24 w-full" />
        </div>
      )}
    </div>
  );
}
