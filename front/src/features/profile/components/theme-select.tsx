import { ChangeEvent, useMemo, useState } from "react";
import { themeLabels } from "../../../config/themes";

interface ThemeSelectProps {
  label: "Thème clair" | "Thème sombre";
  themesList: readonly string[];
  onThemeChange: (newTheme: string, mode: "light" | "dark") => void;
}

const ThemeSwatch = ({ theme }: { theme: string }) => (
  <span
    data-theme={theme}
    className="flex size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-base-content/20"
    aria-hidden="true"
  >
    <span className="h-full w-1/3 bg-primary" />
    <span className="h-full w-1/3 bg-secondary" />
    <span className="h-full w-1/3 bg-accent" />
  </span>
);

export default function ThemeSelect({
  label,
  themesList,
  onThemeChange,
}: ThemeSelectProps) {
  const mode = useMemo(() => {
    return label === "Thème clair" ? "light" : "dark";
  }, [label]);

  const [selectedTheme, setSelectedTheme] = useState(
    () => localStorage.getItem(`${mode}Theme`) || "Aucun thème sélectionné",
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.value;
    setSelectedTheme(newTheme);
    onThemeChange(newTheme, mode);
  };

  return (
    <span className="w-full flex justify-between items-center">
      <label htmlFor={`${mode}ThemeDropdown`}>{label}</label>

      <div className="dropdown" id={`${mode}ThemeDropdown`}>
        <div tabIndex={0} role="button" className="btn m-1 gap-2">
          <ThemeSwatch theme={selectedTheme} />
          {themeLabels[selectedTheme] ?? selectedTheme}
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
          className="dropdown-content max-h-80 overflow-y-auto bg-base-300 rounded-box z-10 w-60 p-2 shadow-2xl"
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
                  {themeLabels[theme] ?? theme}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </span>
  );
}
