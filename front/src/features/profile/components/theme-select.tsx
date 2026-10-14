import { ChangeEvent, useMemo, useState } from "react";
import { themeLabels } from "../../../config/themes";
import { cn } from "../../../utils/cn";
import { ThemeSwatch } from "./theme-swatch";

/** Le mode (clair ou sombre) est déjà choisi : « Classique sombre » se lit « Classique ». */
const themeName = (theme: string): string =>
  (themeLabels[theme] ?? theme).replace(/ sombre$/, "");

interface ThemeSelectProps {
  label: "Thème clair" | "Thème sombre";
  themesList: readonly string[];
  onThemeChange: (newTheme: string, mode: "light" | "dark") => void;
  dropdownClassName?: string;
  compact?: boolean;
  selectedTheme?: string;
  /**
   * Thèmes dont le nom le plus long fixe la largeur du bouton : il ne varie plus
   * quand le thème ou le mode change.
   */
  reserveWidthFor?: readonly string[];
}

export default function ThemeSelect({
  label,
  themesList,
  onThemeChange,
  dropdownClassName = "",
  compact = false,
  selectedTheme: controlledTheme,
  reserveWidthFor,
}: ThemeSelectProps) {
  const mode = useMemo(() => {
    return label === "Thème clair" ? "light" : "dark";
  }, [label]);

  const [internalTheme, setInternalTheme] = useState(
    () => localStorage.getItem(`${mode}Theme`) || "Aucun thème sélectionné",
  );
  const selectedTheme = controlledTheme ?? internalTheme;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.value;
    setInternalTheme(newTheme);
    onThemeChange(newTheme, mode);
  };

  return (
    <span
      className={
        cn(compact
          ? "min-w-0 shrink-0"
          : "w-full flex justify-between items-center")
      }
    >
      {!compact && <label htmlFor={`${mode}ThemeDropdown`}>{label}</label>}

      <div
        className={cn("dropdown", dropdownClassName)}
        id={`${mode}ThemeDropdown`}
      >
        <div
          tabIndex={0}
          role="button"
          aria-label={`Choisir le ${label.toLowerCase()}`}
          className={
            cn(compact
              ? cn("btn btn-sm h-8 min-h-8 max-w-32 min-w-0 gap-1 px-2", reserveWidthFor && "max-w-none")
              : "btn m-1 gap-2")
          }
        >
          <ThemeSwatch theme={selectedTheme} />
          {reserveWidthFor ? (
            // Tous les noms se superposent : le plus long donne sa largeur au bouton.
            <span className="grid">
              <span className="col-start-1 row-start-1 truncate">
                {themeName(selectedTheme)}
              </span>
              {reserveWidthFor.map((theme) => (
                <span
                  key={theme}
                  aria-hidden="true"
                  className="invisible col-start-1 row-start-1 h-0 overflow-hidden"
                >
                  {themeName(theme)}
                </span>
              ))}
            </span>
          ) : (
            <span className="truncate">
              {themeName(selectedTheme)}
            </span>
          )}
          <svg
            width="12px"
            height="12px"
            className="inline-block h-2 w-2 fill-current opacity-60"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 2048 2048"
          >
            <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
          </svg>
        </div>

        <ul
          tabIndex={-1}
          className="dropdown-content z-10 min-w-max rounded-box bg-base-300 p-2 shadow-2xl"
        >
          {themesList.map((theme) => (
            <li key={theme}>
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`${mode}Theme`}
                  className="hidden"
                  value={theme}
                  onChange={handleChange}
                />
                <span className="btn btn-sm btn-block btn-ghost justify-start gap-3">
                  <ThemeSwatch theme={theme} />
                  {themeName(theme)}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </span>
  );
}
