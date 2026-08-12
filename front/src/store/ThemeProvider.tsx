import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { themes } from "../config/themes";

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

const initializeTheme = (): "light" | "dark" => {
  const lightTheme = localStorage.getItem("lightTheme");
  const darkTheme = localStorage.getItem("darkTheme");

  if (lightTheme) themes.light = lightTheme;
  else localStorage.setItem("lightTheme", themes.light);

  if (darkTheme) themes.dark = darkTheme;
  else localStorage.setItem("darkTheme", themes.dark);

  const activeTheme = localStorage.getItem("activeTheme");
  if (activeTheme === "light" || activeTheme === "dark") return activeTheme;

  localStorage.setItem("activeTheme", "light");
  return "light";
};

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<"light" | "dark">(initializeTheme);

  const chooseTheme = useCallback(
    (newTheme: string, mode: "light" | "dark") => {
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
