import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../../utils/cn";

type CollapsibleSectionProps = {
  title: string;
  icon?: ReactNode;
  preview: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

const CollapsibleSection = ({
  title,
  icon,
  preview,
  children,
  defaultOpen = false,
  open,
  onOpenChange,
  className,
}: CollapsibleSectionProps) => {
  return (
    <details
      className={cn("group min-w-0 rounded-lg bg-secondary/20", className)}
      open={open ?? defaultOpen}
      onToggle={(event) => onOpenChange?.(event.currentTarget.open)}
    >
      <summary className="min-h-28 cursor-pointer list-none px-5 py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary group-open:min-h-14 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center justify-between gap-4">
          <span
            role="heading"
            aria-level={2}
            className="flex min-w-0 items-center gap-2 text-xl font-bold text-primary"
          >
            {icon}
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
