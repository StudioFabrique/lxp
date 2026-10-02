import AndriaLogoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";
import AndriaLogoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import { useContext, useEffect, useState, type PropsWithChildren } from "react";
import { Sun, Moon, LogOut } from "lucide-react";
import { ThemeContext } from "../../../store/ThemeProvider";
import { AuthContext } from "../../../store/AuthProvider";
import { useAuthBackground } from "../hooks/useAuthBackground";
import LoginRightColumn from "./LoginRightColumn";
import LoginGuard from "../../../components/guards/LoginGuard";
import { useLocation, useNavigate } from "react-router";
import { profileApi } from "../../profile/api/profile.api";
import { INSTANCE_LOGO, INSTANCE_LOGO_COLOR } from "../../../config/urls";
import { cn } from "../../../utils/cn";
import ReleaseNotesModal from "../../../components/UI/ReleaseNotesModal";
import { currentRelease } from "../../../config/release-notes";
import { AuthHeaderActionContext } from "./AuthHeaderActionContext";

const AuthLayout = ({ children, setupStyle = false }: PropsWithChildren<{ setupStyle?: boolean }>) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isLoggedIn, isLoading, logout } = useContext(AuthContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showReleaseNotes, setShowReleaseNotes] = useState(false);
  const [headerActionHost, setHeaderActionHost] = useState<HTMLDivElement | null>(null);
  const { background, isFailed } = useAuthBackground(theme);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isStudentOnboarding = pathname === "/student/onboarding";
  const isStaffOnboarding = pathname === "/staff/onboarding";
  const isOnboarding = isStudentOnboarding || isStaffOnboarding;
  const isInstanceSetup = pathname === "/instance-setup";
  const isAccountActivation = pathname === "/register";
  const isAdminInit = pathname === "/init";
  const hasSetupLayout = isAdminInit || pathname === "/confirm-email" || setupStyle;
  const isOnboardingLayout = isOnboarding || isInstanceSetup || isAccountActivation || hasSetupLayout;
  const showOrganizationName =
    pathname === "/login" || pathname === "/reset-password";
  const shouldLoadBranding = showOrganizationName || isOnboarding;
  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [hasOrganizationLogo, setHasOrganizationLogo] = useState(false);
  const [organizationLogoBackground, setOrganizationLogoBackground] = useState("#ffffff");

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

  useEffect(() => {
    if (!isOnboarding || !hasOrganizationLogo) return;
    const controller = new AbortController();
    fetch(INSTANCE_LOGO_COLOR, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Couleur du logo indisponible");
        return response.text();
      })
      .then((color) => {
        const savedColor = color.trim();
        if (/^#[0-9a-f]{6}$/i.test(savedColor)) {
          setOrganizationLogoBackground(savedColor);
        }
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [isOnboarding, hasOrganizationLogo]);

  return (
    <div className={cn("relative min-h-screen w-full font-inter bg-base-100 flex", isOnboardingLayout ? "py-4 lg:items-center lg:py-0" : "py-12")}>
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 w-full", isOnboardingLayout && "lg:h-[85vh] lg:min-h-[600px]")}>
        <div className={cn("relative flex flex-col items-center px-8 w-full h-full", isOnboardingLayout ? "min-h-[calc(100vh-2rem)] lg:min-h-0 lg:h-full" : "min-h-[calc(100vh-6rem)]")}>
          <div className={cn("absolute right-4 z-10 flex items-center gap-1 lg:right-8", isStudentOnboarding ? "top-6" : "top-0")}>
            <div ref={setHeaderActionHost} className="contents" />
            {isOnboardingLayout && isLoggedIn && (
              <button
                type="button"
                className="btn btn-circle btn-ghost text-base-content/70 transition-colors hover:text-base-content"
                aria-label="Se déconnecter"
                title="Se déconnecter"
                disabled={isLoggingOut}
                onClick={async () => {
                  setIsLoggingOut(true);
                  await logout();
                  navigate("/login", { replace: true });
                }}
              >
                <LogOut className="size-5" />
              </button>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-circle btn-ghost text-base-content/70 transition-colors hover:text-base-content"
              aria-label="Changer le thème"
            >
              {theme === "light" ? (
                <Moon className="size-5" />
              ) : (
                <Sun className="size-5" />
              )}
            </button>
          </div>

          <div
            className={cn("relative mx-auto flex h-full min-h-0 flex-col", isOnboarding
                ? "w-full max-w-2xl"
                : isInstanceSetup || isAccountActivation || hasSetupLayout
                  ? "w-full max-w-xl"
                  : "w-100")}
          >
            {!isOnboarding && !hasSetupLayout && (
              <div
                className={cn("flex select-none flex-col items-center gap-2", isAdminInit ? "mb-10" : "mb-8")}
              >
                <img
                  className={cn("h-auto w-56", isOnboardingLayout ? "mt-0" : "mt-20")}
                  src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
                  alt="logo ANDRIA"
                />
                <span className="mt-2 max-w-xs text-center text-xs font-semibold text-base-content">
                  Apprentissage Numérique & Développement Renforcé par
                  Intelligence Artificielle
                </span>
              </div>
            )}

            <div className="relative flex min-h-0 w-full flex-1 flex-col">
              {pathname === "/login" && (isLoading || isLoggedIn) && (
                <div className="absolute inset-0 z-20 flex items-start justify-center bg-base-100/90 pt-36" role="status" aria-live="polite">
                  <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-base-content">
                    <span className="loading loading-spinner loading-md text-primary" aria-hidden="true" />
                    <span className="font-medium">Connexion en cours…</span>
                  </div>
                </div>
              )}
              <AuthHeaderActionContext value={headerActionHost}>
                {children ?? <LoginGuard />}
              </AuthHeaderActionContext>
            </div>

            {isOnboarding && (
              <div className="absolute inset-x-0 top-full mt-2 flex min-h-8 select-none items-center justify-center gap-4" aria-label="Partenaires de la plateforme">
                <img
                  className="h-6 w-auto"
                  src={theme === "light" ? AndriaLogoLightMode : AndriaLogoDarkMode}
                  alt="ANDRIA"
                  draggable={false}
                />
                {hasOrganizationLogo && (
                  <>
                    <span className="h-5 w-px bg-base-content/20" aria-hidden="true" />
                    <span
                      className="flex min-h-8 items-center rounded-md px-2 py-1"
                      style={{ backgroundColor: organizationLogoBackground }}
                    >
                      <img
                        className="max-h-8 max-w-28 object-contain"
                        src={INSTANCE_LOGO}
                        alt={organizationName ? `Logo ${organizationName}` : "Logo de l’organisme"}
                        draggable={false}
                      />
                    </span>
                  </>
                )}
              </div>
            )}

            {showOrganizationName && (organizationName || pathname === "/login") && (
              <div className="mt-auto flex items-center justify-center gap-2 pt-6 text-center text-xs text-base-content/60">
                {organizationName && <p>{organizationName}</p>}
                {pathname === "/login" && (
                  <>
                    {organizationName && <span className="h-3 border-l border-current opacity-40" aria-hidden="true" />}
                    <button
                      type="button"
                      onClick={() => setShowReleaseNotes(true)}
                      className="link"
                      aria-label={`Voir les notes de version ${currentRelease.version}`}
                    >
                      ANDRIA v{currentRelease.version} - {currentRelease.status}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Colonne Droite */}
        <LoginRightColumn background={background} isFailed={isFailed} alignTop={isOnboardingLayout} />
      </div>
      {showReleaseNotes && (
        <ReleaseNotesModal onClose={() => setShowReleaseNotes(false)} />
      )}
    </div>
  );
};

export default AuthLayout;
