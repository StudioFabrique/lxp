import { useContext } from "react";
import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { ThemeContext } from "../../../store/ThemeProvider";

export function LearningChoiceCardsPlaceholder() {
  const { theme } = useContext(ThemeContext);

  return (
    <section
      aria-busy="true"
      aria-label="Chargement de votre parcours"
      className="mt-[clamp(2.5rem,7vh,6rem)] flex w-full flex-col items-center gap-2 text-center"
    >
      <img
        className="h-auto w-56"
        src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
        alt="logo ANDRIA"
      />
      <span className="mt-2 max-w-xs text-xs font-semibold text-base-content">
        Apprentissage Numérique &amp; Développement Renforcé par Intelligence
        Artificielle
      </span>
      <p className="mt-8 text-sm text-base-content/60" role="status">
        Chargement de votre parcours…
      </p>
    </section>
  );
}
