import { ArrowDownUp, LogOutIcon } from "lucide-react";
import { useContext } from "react";
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

  const handleClickLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav
      aria-label="Navigation de la présentation"
      className="flex w-[min(42rem,calc(100vw-1rem))] items-center gap-3 rounded-xl border border-(--sidebar-border) bg-(--sidebar-bg) px-3 py-2 text-(--sidebar-content) shadow-sm transition-colors duration-200"
    >
      <div className="w-24 shrink-0">
        <SidebarLogo />
      </div>
      {/* Même bloc que dans le menu du profil, teinté pour se détacher du fond de la barre. */}
      <div className="flex min-w-0 flex-1 justify-center">
        <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg bg-(--sidebar-content)/12 p-1.5 text-xs">
          <span className="ml-1 shrink-0">
            Mode {theme === "light" ? "clair" : "sombre"}
          </span>
          <div className="flex items-center gap-1">
            <ThemeSelect
              key={theme}
              label={theme === "light" ? "Thème clair" : "Thème sombre"}
              themesList={theme === "light" ? availableLightThemes : availableDarkThemes}
              onThemeChange={chooseTheme}
              dropdownClassName="dropdown-end"
              compact
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-square"
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
        className="flex min-h-8 shrink-0 cursor-pointer items-center gap-2 rounded-lg px-2 text-sm transition-colors hover:bg-(--sidebar-hover)"
        onClick={handleClickLogout}
      >
        <LogOutIcon className="size-4 shrink-0" aria-hidden="true" />
        Déconnexion
      </button>
    </nav>
  );
};

export default SidebarIntroBar;
