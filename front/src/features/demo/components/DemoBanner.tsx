import { Eye } from "lucide-react";

/** Rappel permanent que l'on regarde une démonstration, et non des données réelles. */
const DemoBanner = () => (
  <div
    className="flex items-center justify-center gap-2 bg-primary px-4 py-1.5 text-xs font-medium text-primary-content"
    role="status"
  >
    <Eye className="h-4 w-4 shrink-0" />
    <span>
      Mode démonstration — contenus fictifs, en consultation seule.
    </span>
  </div>
);

export default DemoBanner;
