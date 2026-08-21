/** Rappel permanent que l'on regarde une démonstration, et non des données réelles. */
const DemoBanner = () => (
  <div
    className="flex items-center justify-center gap-2 bg-primary px-4 py-1.5 text-xs font-medium text-primary-content rounded-xl"
    role="status"
  >
    <span>Mode démonstration</span>
  </div>
);

export default DemoBanner;
