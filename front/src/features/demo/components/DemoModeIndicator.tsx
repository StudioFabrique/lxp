import { MonitorPlay } from "lucide-react";
import { useSidebarDisplay } from "../../../components/sidebar/sidebar-display";
import { cn } from "../../../utils/cn";

/** Indicateur persistant du mode démonstration, intégré à la navigation. */
const DemoModeIndicator = () => {
  const { expanded } = useSidebarDisplay();

  return (
    <div
      className="max-2xl:tooltip max-2xl:tooltip-right w-fit mb-3"
      data-tip="Mode démonstration"
    >
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[var(--sidebar-border)] bg-[var(--sidebar-surface)] px-2 py-2 text-xs font-medium text-[var(--sidebar-content)]",
          expanded ? "px-3" : "justify-center 2xl:justify-start 2xl:px-3",
        )}
        role="status"
        aria-label="Mode démonstration"
      >
        <MonitorPlay className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className={cn(expanded ? "inline" : "hidden 2xl:inline")}>
          Mode démonstration
        </span>
      </div>
    </div>
  );
};

export default DemoModeIndicator;
