import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { darkThemes, lightThemes, themes } from "../config/themes";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  chooseTheme: (newTheme: string, mode: "light" | "dark") => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  chooseTheme: () => {},
});

const getAvailableTheme = (
  storedTheme: string | null,
  availableThemes: readonly string[],
  fallbackTheme: string,
) =>
  storedTheme && availableThemes.includes(storedTheme)
    ? storedTheme
    : fallbackTheme;

const initializeTheme = (): "light" | "dark" => {
  themes.light = getAvailableTheme(
    localStorage.getItem("lightTheme"),
    lightThemes,
    "classic",
  );
  themes.dark = getAvailableTheme(
    localStorage.getItem("darkTheme"),
    darkThemes,
    "classic-dark",
  );

  // Remplace aussi les anciens thèmes retirés dans le stockage du navigateur.
  localStorage.setItem("lightTheme", themes.light);
  localStorage.setItem("darkTheme", themes.dark);

  const activeTheme = localStorage.getItem("activeTheme");
  if (activeTheme === "light" || activeTheme === "dark") return activeTheme;

  localStorage.setItem("activeTheme", "light");
  return "light";
};

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<"light" | "dark">(initializeTheme);

  const chooseTheme = useCallback(
    (newTheme: string, mode: "light" | "dark") => {
      const availableThemes = mode === "light" ? lightThemes : darkThemes;
      if (!availableThemes.some((availableTheme) => availableTheme === newTheme))
        return;

      if (mode === "light") {
        themes.light = newTheme;
        localStorage.setItem("lightTheme", newTheme);
      } else {
        themes.dark = newTheme;
        localStorage.setItem("darkTheme", newTheme);
      }
      localStorage.setItem("activeTheme", mode);
      setTheme(mode);

      // React ne relance pas l'effet si le mode est déjà actif. Le thème
      // sélectionné doit néanmoins être appliqué immédiatement.
      document.documentElement.setAttribute("data-theme", newTheme);
    },
    [],
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("activeTheme", newTheme);
      return newTheme;
    });
  }, []);

  useEffect(() => {
    document
      .querySelector("html")!
      .setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark,
      );
  }, [theme]);

  return (
    <ThemeContext value={{ theme, toggleTheme, chooseTheme }}>
      {children}
    </ThemeContext>
  );
};

export { ThemeContext, ThemeProvider };
