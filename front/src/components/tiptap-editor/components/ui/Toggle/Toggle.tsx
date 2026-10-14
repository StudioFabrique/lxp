import { cn } from "../../../../../utils/cn";

export type ToggleProps = {
  active?: boolean;
  onChange: (active: boolean) => void;
  size?: "small" | "large";
};

export const Toggle = ({
  onChange,
  active = false,
  size = "large",
}: ToggleProps) => {
  const state = active ? "checked" : "unchecked";
  const value = active ? "on" : "off";

  return (
    <input
      className={cn("toggle toggle-primary", size === "small" ? "toggle-xs" : "toggle-sm")}
      type="checkbox"
      role="switch"
      checked={active}
      aria-checked={active}
      data-state={state}
      value={value}
      onChange={(event) => onChange(event.target.checked)}
    />
  );
};
