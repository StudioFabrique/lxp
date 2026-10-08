import { ArrowDownUp, LogOutIcon } from "lucide-react";
import { useContext, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router";

import SidebarLogo from "./SidebarLogo";
import ThemeSelect from "../../features/profile/components/theme-select";
import { AuthContext } from "../../store/AuthProvider";
import { ThemeContext } from "../../store/ThemeProvider";

/**
 * Barre latérale compacte et horizontale de la présentation : le temps de
 * l'exploration des contenus, seuls le logo, le thème (comme dans le menu du profil) et la déconnexion
 * restent disponibles. La barre complète se construit ensuite.
 */
const SidebarIntroBar = () => {
  const { logout } = useContext(AuthContext);
  const {
    theme,
    toggleTheme,
    chooseTheme,
    availableLightThemes,
    availableDarkThemes,
  } = useContext(ThemeContext);
  const navigate = useNavigate();
  const barRef = useRef<HTMLElement>(null);

  // La largeur de la barre dépend de son contenu : la scène en a besoin pour
  // centrer son titre dans l'espace restant.
  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const root = document.documentElement;
    const publish = () =>
      root.style.setProperty("--intro-bar-width", `${bar.offsetWidth}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--intro-bar-width");
    };
  }, []);

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav
      ref={barRef}
      aria-label="Navigation de la présentation"
      className="flex w-fit max-w-[calc(100vw-1rem)] items-center gap-5 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) px-3 py-2 text-(--sidebar-content) shadow-sm transition-colors duration-200"
    >
      <div className="w-24 shrink-0">
        <SidebarLogo />
      </div>
      {/* Même bloc que dans le menu du profil, teinté pour se détacher du fond de la barre. */}
      <div className="flex min-w-0 justify-center">
        <div className="flex min-w-0 items-center justify-between gap-4 rounded-lg bg-(--sidebar-content)/12 p-2 text-xs">
          {/* Les deux libellés se superposent : la largeur ne change pas avec le mode. */}
          <span className="ml-1 grid shrink-0">
            <span className="col-start-1 row-start-1">
              Mode {theme === "light" ? "clair" : "sombre"}
            </span>
            <span aria-hidden="true" className="invisible col-start-1 row-start-1 h-0 overflow-hidden">
              Mode sombre
            </span>
          </span>
          <div className="flex items-center gap-2">
            <ThemeSelect
              key={theme}
              label={theme === "light" ? "Thème clair" : "Thème sombre"}
              themesList={theme === "light" ? availableLightThemes : availableDarkThemes}
              onThemeChange={chooseTheme}
              dropdownClassName="dropdown-end"
              reserveWidthFor={[...availableLightThemes, ...availableDarkThemes]}
              compact
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square text-(--sidebar-content) hover:bg-(--sidebar-hover)"
              onClick={toggleTheme}
              aria-label="Changer de mode d'affichage"
            >
              <ArrowDownUp className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="tooltip tooltip-bottom ml-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-(--sidebar-hover)"
        data-tip="Déconnexion"
        aria-label="Déconnexion"
        onClick={handleClickLogout}
      >
        <LogOutIcon className="size-4 shrink-0" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default SidebarIntroBar;
