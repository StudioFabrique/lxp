import { useState } from "react";

type Props = {
  onColorChange: (color: string) => void;
  defaultColor?: string;
};

const ColorPicker = ({ onColorChange, defaultColor = "#ffffff" }: Props) => {
  const [selectedColor, setSelectedColor] = useState(defaultColor);

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

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
    // Close dropdown after selection
    const elem = document.activeElement as HTMLElement;
    elem?.blur();
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-dash btn-sm gap-2">
        <div
          className="w-4 h-4 border border-base-300"
          style={{ backgroundColor: selectedColor }}
        />
        Couleur de fond
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-[1] bottom-10 left-0 card card-compact w-64 p-4 shadow bg-base-100 rounded-box rounded-lg"
      >
        <div className="card-body">
          <h3 className="card-title text-sm">Choisir une couleur</h3>

          {/* Predefined colors grid */}
          <div className="flex flex-wrap gap-5 mb-3">
            {predefinedColors.map((color) => (
              <button
                key={color.hex}
                type="button"
                className={`cursor-pointer w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform ${
                  selectedColor === color.hex
                    ? "border-primary"
                    : "border-base-300"
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleColorSelect(color.hex)}
                title={color.name}
              />
            ))}
          </div>

          {/* Native color input */}
          <div className="form-control flex gap-2">
            <label className="label">
              <span className="label-text text-xs">Couleur personnalisée</span>
            </label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="input border-0 input-sm p-0 w-10 h-10 cursor-pointer"
            />
          </div>

          {/* Display hex value */}
          <div className="text-center text-xs font-mono mt-2 text-base-content/70">
            {selectedColor}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
