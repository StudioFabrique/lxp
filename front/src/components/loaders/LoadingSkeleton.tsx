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
      {variant === "cards" ? (
        <div className="grid items-start gap-5 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="rounded-box border border-base-300 bg-base-100 p-5">
              <div className="skeleton mb-5 h-28 w-full rounded-lg" />
              <div className="space-y-3">{lines}</div>
            </div>
          ))}
        </div>
      ) : variant === "rows" ? (
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-100" aria-hidden="true">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-4 border-b border-base-300 p-4 last:border-b-0">
              <div className="skeleton size-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : variant === "detail" ? (
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
