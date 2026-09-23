import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";

type VisualPreferences = {
  glow: boolean;
  confetti: boolean;
  animations: boolean;
};

type VisualPreferencesContextValue = VisualPreferences & {
  setPreference: (key: keyof VisualPreferences, enabled: boolean) => void;
};

const storageKey = "visualPreferences";
const defaults: VisualPreferences = { glow: true, confetti: true, animations: true };

const readPreferences = (): VisualPreferences => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null");
    if (!stored || typeof stored !== "object") return defaults;
    return {
      glow: typeof stored.glow === "boolean" ? stored.glow : true,
      confetti: typeof stored.confetti === "boolean" ? stored.confetti : true,
      animations: typeof stored.animations === "boolean" ? stored.animations : true,
    };
  } catch {
    return defaults;
  }
};

const VisualPreferencesContext = createContext<VisualPreferencesContextValue>({
  ...defaults,
  setPreference: () => {},
});

export function VisualPreferencesProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState(readPreferences);

  useEffect(() => {
    const sync = () => setPreferences(readPreferences());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const setPreference = (key: keyof VisualPreferences, enabled: boolean) => {
    setPreferences((current) => {
      const next = { ...current, [key]: enabled };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Le réglage reste actif pour la session si le stockage est indisponible.
      }
      return next;
    });
  };

  return (
    <VisualPreferencesContext value={{ ...preferences, setPreference }}>
      {children}
    </VisualPreferencesContext>
  );
}

export const useVisualPreferences = () => useContext(VisualPreferencesContext);
