import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  darkThemes,
  defaultEnabledThemes,
  lightThemes,
  themes,
} from "../config/themes";
import { BASE_API_URL } from "../config/urls";

type ThemeContextType = {
  theme: "light" | "dark";
  toggleTheme: () => void;
  chooseTheme: (newTheme: string, mode: "light" | "dark") => void;
  availableLightThemes: readonly string[];
  availableDarkThemes: readonly string[];
};

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  chooseTheme: () => {},
  availableLightThemes: defaultEnabledThemes.filter((theme) => lightThemes.includes(theme as never)),
  availableDarkThemes: defaultEnabledThemes.filter((theme) => darkThemes.includes(theme as never)),
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
  if (activeTheme === "light" || activeTheme === "dark") {
    localStorage.setItem("themePreferenceSet", "true");
    return activeTheme;
  }

  localStorage.setItem("activeTheme", "light");
  return "light";
};

const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [theme, setTheme] = useState<"light" | "dark">(initializeTheme);
  const [availableLightThemes, setAvailableLightThemes] = useState<readonly string[]>(
    defaultEnabledThemes.filter((item) => lightThemes.includes(item as never)),
  );
  const [availableDarkThemes, setAvailableDarkThemes] = useState<readonly string[]>(
    defaultEnabledThemes.filter((item) => darkThemes.includes(item as never)),
  );

  const chooseTheme = useCallback(
    (newTheme: string, mode: "light" | "dark") => {
      const availableThemes = mode === "light" ? availableLightThemes : availableDarkThemes;
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
      localStorage.setItem("themePreferenceSet", "true");
      setTheme(mode);

      // React ne relance pas l'effet si le mode est déjà actif. Le thème
      // sélectionné doit néanmoins être appliqué immédiatement.
      document.documentElement.setAttribute("data-theme", newTheme);
    },
    [availableDarkThemes, availableLightThemes],
  );

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      localStorage.setItem("activeTheme", newTheme);
      localStorage.setItem("themePreferenceSet", "true");
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

  useEffect(() => {
    const abortController = new AbortController();
    fetch(`${BASE_API_URL}/instance-settings`, {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Paramètres indisponibles");
        return response.json() as Promise<{ enabledThemes?: string[] }>;
      })
      .then(({ enabledThemes }) => {
        if (!Array.isArray(enabledThemes)) return;
        const enabledLight = lightThemes.filter((item) => enabledThemes.includes(item));
        const enabledDark = darkThemes.filter((item) => enabledThemes.includes(item));
        if (!enabledLight.length || !enabledDark.length) return;
        setAvailableLightThemes(enabledLight);
        setAvailableDarkThemes(enabledDark);

        themes.light = getAvailableTheme(localStorage.getItem("lightTheme"), enabledLight, enabledLight[0]);
        themes.dark = getAvailableTheme(localStorage.getItem("darkTheme"), enabledDark, enabledDark[0]);
        localStorage.setItem("lightTheme", themes.light);
        localStorage.setItem("darkTheme", themes.dark);
        document.documentElement.setAttribute("data-theme", themes[theme]);
      })
      .catch(() => undefined);

    return () => abortController.abort();
  }, [theme]);

  return (
    <ThemeContext value={{ theme, toggleTheme, chooseTheme, availableLightThemes, availableDarkThemes }}>
      {children}
    </ThemeContext>
  );
};

export { ThemeContext, ThemeProvider };
