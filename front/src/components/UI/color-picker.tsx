import { cn } from "../../utils/cn";
type Props = {
  onColorChange: (color: string) => void;
  defaultColor?: string;
  compact?: boolean;
};

const ColorPicker = ({
  onColorChange,
  defaultColor = "#ffffff",
  compact = false,
}: Props) => {
  const selectedColor = defaultColor;

  const predefinedColors = [
    { name: "White", hex: "#ffffff" },
    { name: "Black", hex: "#000000" },
    { name: "Slate", hex: "#64748b" },
    { name: "Blue", hex: "#3b82f6" },
    { name: "Purple", hex: "#a855f7" },
    { name: "Pink", hex: "#ec4899" },
    { name: "Red", hex: "#ef4444" },
    { name: "Orange", hex: "#f97316" },
    { name: "Green", hex: "#22c55e" },
    { name: "Teal", hex: "#14b8a6" },
    { name: "Indigo", hex: "#6366f1" },
    { name: "Gray", hex: "#6b7280" },
  ];
  const visibleColors = compact
    ? predefinedColors.filter(({ name }) =>
        [
          "White",
          "Black",
          "Slate",
          "Blue",
          "Purple",
          "Orange",
          "Green",
          "Teal",
        ].includes(name),
      )
    : predefinedColors;

  const handlePredefinedColorSelect = (color: string) => {
    onColorChange(color);
    const elem = document.activeElement as HTMLElement;
    elem?.blur();
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        aria-label="Couleur de fond du logo"
        title="Couleur de fond du logo"
        className={
          cn(compact
            ? "btn btn-square btn-sm border p-1 shadow-sm"
            : "btn btn-dash btn-sm gap-2")
        }
        style={
          compact
            ? { backgroundColor: "#ffffff", borderColor: "#cbd5e1" }
            : undefined
        }
      >
        <div
          className={
            cn(compact
              ? "h-5 w-5 rounded border"
              : "h-4 w-4 border border-base-300")
          }
          style={{
            backgroundColor: selectedColor,
            ...(compact ? { borderColor: "#cbd5e1" } : {}),
          }}
        />
        {!compact && (
          <span className="font-mono">{selectedColor.toUpperCase()}</span>
        )}
      </div>

      <div
        tabIndex={0}
        className={cn("dropdown-content z-20 card card-compact rounded-box bg-base-100 shadow", compact ? "right-0 top-10 w-56 p-4 sm:left-full sm:right-auto sm:top-0 sm:ml-2" : "bottom-10 left-0 w-64 p-4")}
      >
        <div className={cn(compact ? "card-body gap-3 p-0" : "card-body")}>
          <h3 className={cn(compact ? "text-xs font-bold" : "card-title text-sm")}>
            Choisir une couleur de fond
          </h3>

          <div
            className={
              cn(compact ? "grid grid-cols-4 gap-3" : "mb-3 flex flex-wrap gap-5")
            }
          >
            {visibleColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                className={cn("cursor-pointer rounded-lg border-2 transition-transform hover:scale-110", compact ? "h-9 w-9" : "h-10 w-10", selectedColor === color.hex
                    ? "border-primary"
                    : "border-base-300")}
                style={{ backgroundColor: color.hex }}
                onClick={() => handlePredefinedColorSelect(color.hex)}
                title={color.name}
              />
            ))}
          </div>

          <div
            className={
              cn(compact
                ? "flex items-center justify-between gap-2"
                : "form-control flex gap-2")
            }
          >
            <label className={cn(compact ? "text-xs" : "label")}>
              <span className={cn(compact ? "" : "label-text text-xs")}>
                Couleur personnalisée
              </span>
            </label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange(e.target.value)}
              className={cn("input input-sm cursor-pointer border-0 p-0", compact ? "h-9 w-9 shrink-0" : "h-10 w-10")}
            />
          </div>

          {!compact && (
            <div className="mt-2 text-center font-mono text-xs text-base-content/70">
              {selectedColor}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
