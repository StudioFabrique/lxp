import React, { FC, useCallback, useEffect, useState } from "react";
import { themes } from "../config/themes";

type ThemeContextType = {
  theme: string;
  initTheme: () => void;
  toggleTheme: () => void;
  chooseTheme: (newTheme: string, mode: string) => void;
};

const ThemeContext = React.createContext<ThemeContextType>({
  theme: themes.light,
  initTheme: () => {},
  toggleTheme: () => {},
  chooseTheme: () => {},
});

export const ThemeProvider: FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState("");

  const initTheme = useCallback(() => {
    const lightTheme = localStorage.getItem("lightTheme");
    const darkTheme = localStorage.getItem("darkTheme");

    if (lightTheme) {
      themes.light = lightTheme;
    } else {
      localStorage.setItem("lightTheme", "winter");
    }

    if (darkTheme) {
      themes.dark = darkTheme;
    } else {
      localStorage.setItem("darkTheme", "night");
    }

    const activeTheme = localStorage.getItem("activeTheme");
    if (activeTheme) {
      setTheme(activeTheme);
    } else {
      setTheme("light");
      localStorage.setItem("activeTheme", "light");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("activeTheme", newTheme);
  }, [theme]);

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

  useEffect(() => {
    document
      .querySelector("html")!
      .setAttribute(
        "data-theme",
        theme === "light" ? themes.light : themes.dark
      );
  }, [theme]);

  const value = {
    theme,
    initTheme,
    toggleTheme,
    chooseTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export default ThemeContext;
