import { useContext, useState } from "react";
import { ThemeContext } from "../../store/ThemeProvider";
import { themeLabels } from "../../config/themes";
import { cn } from "../../utils/cn";
import AuthOnboardingChatbot from "../auth/components/AuthOnboardingChatbot";

// Même texte à l'affichage de l'étape et en réponse à « Que dois-je faire à cette étape ? ».
const themeGuidance =
  "Choisissez l’apparence qui vous plaît : un thème clair et un thème sombre. Chaque choix s’applique tout de suite et reste modifiable depuis votre profil.";

export default function ThemeSelectionStep() {
  const { chooseTheme, availableLightThemes, availableDarkThemes } =
    useContext(ThemeContext);
  const [selectedThemes, setSelectedThemes] = useState(() => ({
    light: localStorage.getItem("lightTheme") ?? "classic",
    dark: localStorage.getItem("darkTheme") ?? "classic-dark",
  }));

  return (
    <div className="space-y-4 px-1 py-1">
      <div>
        <h1 className="text-2xl font-bold">Choisissez votre thème</h1>
        <AuthOnboardingChatbot introduction={false} compact
          message={themeGuidance}
          help={{
            action: themeGuidance,
            next: "Quand vos thèmes vous conviennent, utilisez le bouton Continuer en bas de l’étape.",
          }}
        />
      </div>
      {(
        [
          ["light", "Thèmes clairs", availableLightThemes],
          ["dark", "Thèmes sombres", availableDarkThemes],
        ] as const
      ).map(([mode, label, themeList]) => (
        <section key={mode}>
          <h2 className="mb-2 text-sm font-bold">{label}</h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {themeList.map((themeName) => {
              const selected = selectedThemes[mode] === themeName;
              return (
                <button
                  key={themeName}
                  type="button"
                  data-theme={themeName}
                  aria-pressed={selected}
                  onClick={() => {
                    chooseTheme(themeName, mode);
                    setSelectedThemes((current) => ({
                      ...current,
                      [mode]: themeName,
                    }));
                  }}
                  className={cn(
                    "group flex min-h-16 min-w-0 items-center gap-2 rounded-xl border bg-base-200 p-3 text-left shadow-sm transition hover:-translate-y-0.5",
                    selected
                      ? "border-primary ring-2 ring-primary/50"
                      : "border-base-300 hover:border-primary/70",
                  )}
                >
                  <span className="flex size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-base-content/20">
                    <span className="h-full w-1/2 bg-primary" />
                    <span className="h-full w-1/2 bg-secondary" />
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-tight text-base-content">
                    {themeLabels[themeName] ?? themeName}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
