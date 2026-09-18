import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { darkThemes, lightThemes, themes } from "../config/themes";
import { BASE_API_URL } from "../config/urls";

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
  if (activeTheme === "light" || activeTheme === "dark") {
    localStorage.setItem("themePreferenceSet", "true");
    return activeTheme;
  }

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
      localStorage.setItem("themePreferenceSet", "true");
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
    if (localStorage.getItem("themePreferenceSet") === "true") return;

    const abortController = new AbortController();
    fetch(`${BASE_API_URL}/instance-settings`, {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Paramètres indisponibles");
        return response.json() as Promise<{ defaultTheme?: string }>;
      })
      .then(({ defaultTheme }) => {
        if (!defaultTheme) return;
        const mode = lightThemes.includes(
          defaultTheme as (typeof lightThemes)[number],
        )
          ? "light"
          : darkThemes.includes(defaultTheme as (typeof darkThemes)[number])
            ? "dark"
            : null;
        if (!mode) return;

        themes[mode] = defaultTheme;
        localStorage.setItem(`${mode}Theme`, defaultTheme);
        localStorage.setItem("activeTheme", mode);
        document.documentElement.setAttribute("data-theme", defaultTheme);
        setTheme(mode);
      })
      .catch(() => undefined);

    return () => abortController.abort();
  }, []);

  return (
    <ThemeContext value={{ theme, toggleTheme, chooseTheme }}>
      {children}
    </ThemeContext>
  );
};

export { ThemeContext, ThemeProvider };
