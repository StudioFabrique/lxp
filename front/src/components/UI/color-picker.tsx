import * as Popover from "@radix-ui/react-popover";
import { useId, useRef, useState } from "react";
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
  const id = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement>();

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) {
      setPortalContainer(triggerRef.current?.closest("dialog") ?? document.body);
    }
    setOpen(nextOpen);
  };

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
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-label="Couleur de fond du logo"
          title="Couleur de fond du logo"
          className={
            cn(compact
              ? "btn btn-square btn-sm border p-1 shadow-sm"
              : "btn btn-dash btn-sm gap-2")
          }
          style={
            compact
              ? { backgroundColor: "var(--color-base-100)", borderColor: "var(--color-base-300)" }
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
              ...(compact ? { borderColor: "var(--color-base-300)" } : {}),
            }}
          />
          {!compact && (
            <span className="font-mono">{selectedColor.toUpperCase()}</span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal container={portalContainer}>
        <Popover.Content
          side={compact ? "right" : "top"}
          align="start"
          sideOffset={8}
          collisionPadding={12}
          aria-labelledby={`${id}-title`}
          className={cn(
            "z-50 card card-compact max-w-[calc(100vw-1.5rem)] max-h-[var(--radix-popover-content-available-height)] overflow-y-auto rounded-box bg-base-100 p-4 text-base-content shadow-lg",
            compact ? "w-56" : "w-64",
          )}
        >
          <div className={cn(compact ? "card-body gap-3 p-0" : "card-body")}>
            <h3 id={`${id}-title`} className={cn(compact ? "text-xs font-bold" : "card-title text-sm")}>
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
              <label htmlFor={`${id}-color`} className={cn(compact ? "text-xs" : "label")}>
                <span className={cn(compact ? "" : "label-text text-xs")}>
                  Couleur personnalisée
                </span>
              </label>
              <input
                id={`${id}-color`}
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
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ColorPicker;
