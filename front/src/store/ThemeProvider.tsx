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
  initTheme: () => void;
  toggleTheme: () => void;
  chooseTheme: (newTheme: string, mode: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  initTheme: () => {},
  toggleTheme: () => {},
  chooseTheme: () => {},
});

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const initTheme = useCallback(() => {
    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");

    if (lightTheme) themes.light = lightTheme;
    else localStorage.setItem("lightTheme", "classic");

    if (darkTheme) themes.dark = darkTheme;
    else localStorage.setItem("darkTheme", "slate");

    const activeTheme = localStorage.getItem("activeTheme");
    if (activeTheme) {
      setTheme(activeTheme as "light" | "dark");
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  }, []);

  const chooseTheme = useCallback((newTheme: string, mode: string) => {
    if (mode === "light") {
      themes.light = newTheme;
      localStorage.setItem("lightTheme", newTheme);
      setTheme("light");
    } else {
      themes.dark = newTheme;
      localStorage.setItem("darkTheme", newTheme);
      setTheme("dark");
    }
  }, []);

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
    <ThemeContext value={{ theme, initTheme, toggleTheme, chooseTheme }}>
      {children}
    </ThemeContext>
  );
};

export { ThemeContext, ThemeProvider };
