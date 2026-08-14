import { ChangeEvent, useMemo, useState } from "react";

interface ThemeSelectProps {
  label: "Thème clair" | "Thème sombre";
  themesList: string[];
  onThemeChange: (newTheme: string, mode: "light" | "dark") => void;
}

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
        <div tabIndex={0} role="button" className="btn m-1">
          {selectedTheme}
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
          className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl"
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
                <span className="btn btn-sm btn-block btn-ghost justify-start">
                  {theme === "lofi" ? "daltonien" : theme}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </span>
  );
}
