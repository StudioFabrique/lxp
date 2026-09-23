import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "../../../store/ThemeProvider";
import { useAuthBackground } from "../hooks/useAuthBackground";
import LoginRightColumn from "./LoginRightColumn";
import LoginGuard from "../../../components/guards/LoginGuard";
import { useLocation, useNavigate } from "react-router";
import { profileApi } from "../../profile/api/profile.api";
import { INSTANCE_LOGO } from "../../../config/urls";
import { cn } from "../../../utils/cn";

const AuthLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { background, isFailed } = useAuthBackground(theme);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isStudentOnboarding = pathname === "/student/onboarding";
  const isInstanceSetup = pathname === "/instance-setup";
  const showOrganizationName =
    pathname === "/login" || pathname === "/reset-password";
  const shouldLoadBranding = showOrganizationName || isStudentOnboarding;
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [hasOrganizationLogo, setHasOrganizationLogo] = useState(false);

  useEffect(() => {
    if (!shouldLoadBranding) return;
    let active = true;

    profileApi.queries
      .getInstanceSettings()
      .then(({ name, hasLogo }) => {
        if (!active) return;
        setOrganizationName(name.trim() || "ANDRIA");
        setHasOrganizationLogo(hasLogo);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [shouldLoadBranding]);

  return (
    <div className={cn("relative min-h-screen w-full font-inter bg-base-100 flex", isStudentOnboarding ? "py-4" : "py-12")}>
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        <div className={cn("relative flex flex-col items-center px-8 w-full h-full", isStudentOnboarding ? "min-h-[calc(100vh-2rem)]" : "min-h-[calc(100vh-6rem)]")}>
          <button
            onClick={toggleTheme}
            className={cn("absolute right-4 z-10 btn btn-circle btn-ghost text-base-content/70 transition-colors hover:text-base-content lg:right-8", isStudentOnboarding ? "top-8" : "top-0")}
            aria-label="Changer le thème"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          <div
            className={cn("mx-auto flex h-full flex-col", isStudentOnboarding
                ? "w-full max-w-2xl"
                : isInstanceSetup
                  ? "w-full max-w-xl"
                  : "w-100")}
          >
            {!isStudentOnboarding && (
              <div
                className="mb-8 flex cursor-pointer select-none flex-col items-center gap-2"
                onClick={() => navigate("/")}
              >
                <img
                  className="mt-20 h-auto w-56"
                  src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
                  alt="logo ANDRiA"
                />
                <span className="mt-2 max-w-xs text-center text-xs font-semibold text-base-content">
                  Apprentissage Numérique & Développement Renforcé par
                  Intelligence Artificielle
                </span>
              </div>
            )}

            <div className="flex min-h-0 w-full flex-1 flex-col">
              <LoginGuard />
            </div>

            {isStudentOnboarding && (
              <div className="mt-3 flex min-h-8 items-center justify-center gap-4" aria-label="Partenaires de la plateforme">
                <img
                  className="h-6 w-auto"
                  src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
                  alt="ANDRiA"
                />
                {hasOrganizationLogo && (
                  <>
                    <span className="h-5 w-px bg-base-content/20" aria-hidden="true" />
                    <img
                      className="max-h-8 max-w-28 object-contain"
                      src={INSTANCE_LOGO}
                      alt={organizationName ? `Logo ${organizationName}` : "Logo de l’organisme"}
                    />
                  </>
                )}
              </div>
            )}

            {showOrganizationName && organizationName && (
              <p className="mt-auto pt-6 text-center text-xs text-base-content/60">
                {organizationName}
              </p>
            )}
          </div>
        </div>

        {/* Colonne Droite */}
        <LoginRightColumn background={background} isFailed={isFailed} />
      </div>
    </div>
  );
};

export default AuthLayout;
