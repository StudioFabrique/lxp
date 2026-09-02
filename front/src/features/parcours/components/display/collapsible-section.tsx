import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleSectionProps = {
  title: string;
  preview: ReactNode;
  children: ReactNode;
};

const CollapsibleSection = ({
  title,
  preview,
  children,
}: CollapsibleSectionProps) => {
  return (
    <details className="group min-w-0 rounded-lg bg-secondary/20">
      <summary className="min-h-28 cursor-pointer list-none px-5 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary group-open:min-h-14 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-4">
          <span
            role="heading"
            aria-level={2}
            className="text-xl font-bold text-primary"
          >
            {title}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
          />
        </span>
        <span className="mt-3 block group-open:hidden">{preview}</span>
      </summary>
      <div className="px-5 pb-5 pt-1">{children}</div>
    </details>
  );
};

export default CollapsibleSection;
