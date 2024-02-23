import { ChangeEvent, useMemo } from "react";

interface ThemeSelectProps {
  label: string;
  themesList: string[];
  onThemeChange: (newTheme: string, mode: string) => void;
}

export default function ThemeSelect({
  label,
  themesList,
  onThemeChange,
}: ThemeSelectProps) {
  const mode = useMemo(() => {
    return label === "Thème clair" ? "light" : "dark";
  }, [label]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onThemeChange(event.target.value, mode);
  };
  return (
    <span className="w-full flex justify-between items-center">
      <label htmlFor="lightTheme">{label}</label>
      <select
        className="select select-sm select-primary"
        name="lightTheme"
        id="lightTheme"
        onChange={handleChange}
        defaultValue={localStorage.getItem(`${mode}Theme`)!}
      >
        {themesList.map((theme: string) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </span>
  );
}
