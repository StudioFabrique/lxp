import { MonitorPlay } from "lucide-react";

/** Indicateur persistant du mode démonstration, intégré à la navigation. */
const DemoModeIndicator = () => (
  <div
    className="max-xl:tooltip max-xl:tooltip-right w-fit mx-2 mb-3"
    data-tip="Mode démonstration"
  >
    <div
      className="flex items-center justify-center gap-2 rounded-lg bg-base-300 px-2 py-2 text-xs font-medium text-base-content xl:justify-start xl:px-3"
      role="status"
      aria-label="Mode démonstration"
    >
      <MonitorPlay className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden xl:inline">Mode démonstration</span>
    </div>
  </div>
);

export default DemoModeIndicator;
