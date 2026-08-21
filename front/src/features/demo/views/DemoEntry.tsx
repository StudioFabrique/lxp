import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router";
import { GraduationCap, Users } from "lucide-react";

import { AuthContext } from "../../../store/AuthProvider";
import { ThemeContext } from "../../../store/ThemeProvider";
import { useDemoMode } from "../../../store/DemoContext";
import Loader from "../../../components/loaders/Loader";
import ThemeToggle from "../../../components/buttons/ThemeToggle";
import DemoCaptcha from "../components/DemoCaptcha";
import { demoApi, type DemoProfile } from "../api/demo-client";
import { solveChallenge, type DemoSolution } from "../lib/altcha-solver";
import { DEMO_TOUR_STORAGE_KEY } from "../demo-tour-storage";

import logoDarkMode from "../../../assets/andria-logo/logo-darkmode.svg";
import logoLightMode from "../../../assets/andria-logo/logo-lightmode.svg";

const PROFILES: {
  profile: DemoProfile;
  label: string;
  description: string;
  icon: typeof Users;
}[] = [
  {
    profile: "admin",
    label: "Équipe pédagogique",
    description:
      "Le catalogue de formations, la construction des parcours et des modules, le suivi des apprenants.",
    icon: Users,
  },
  {
    profile: "student",
    label: "Apprenant",
    description:
      "L'espace d'apprentissage : parcours, modules, activités et progression.",
    icon: GraduationCap,
  },
];

const DemoEntry = () => {
  const { demoMode, demoUrl, isConfigLoaded } = useDemoMode();
  const { handshake } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [solution, setSolution] = useState<DemoSolution | null>(null);
  const [progress, setProgress] = useState(0);
  const [captchaError, setCaptchaError] = useState("");
  const [pending, setPending] = useState<DemoProfile | null>(null);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const solving = useRef(false);

  // Instance ordinaire : la démonstration vit ailleurs.
  useEffect(() => {
    if (!isConfigLoaded || demoMode) return;
    if (demoUrl) window.location.replace(demoUrl);
    else navigate("/login", { replace: true });
  }, [isConfigLoaded, demoMode, demoUrl, navigate]);

  // La vérification tourne pendant que le visiteur lit la page : quand il a
  // choisi son interface, elle est déjà prête.
  useEffect(() => {
    if (!demoMode || solving.current) return;

    solving.current = true;
    setCaptchaError("");
    setProgress(0);

    let cancelled = false;

    demoApi
      .getChallenge()
      .then((challenge) =>
        solveChallenge(challenge, (ratio) => {
          if (!cancelled) setProgress(ratio);
        }),
      )
      .then((solved) => {
        if (!cancelled) setSolution(solved);
      })
      .catch(() => {
        if (!cancelled) {
          setCaptchaError("La vérification anti-robot n'a pas abouti.");
        }
      })
      .finally(() => {
        solving.current = false;
      });

    return () => {
      cancelled = true;
    };
  }, [demoMode, attempt]);

  const enterDemo = useCallback(
    async (profile: DemoProfile) => {
      if (!solution || pending) return;

      setPending(profile);
      setError("");

      try {
        const { layout } = await demoApi.openSession(profile, solution);

        // Le tour est armé côté navigateur, jamais côté serveur : le compte de
        // démonstration est partagé par tous les visiteurs simultanés, et un
        // état enregistré sur le compte priverait les suivants du tutoriel.
        sessionStorage.setItem(DEMO_TOUR_STORAGE_KEY, layout);

        await handshake();
        navigate(`/${layout}/dashboard`, { replace: true });
      } catch (err) {
        // La solution est à usage unique : après un échec, il en faut une neuve.
        setSolution(null);
        setAttempt((current) => current + 1);
        setError(
          (isAxiosError(err)
            ? (err.response?.data as { message?: string } | undefined)?.message
            : undefined) ?? "La démonstration est momentanément indisponible.",
        );
        setPending(null);
      }
    },
    [solution, pending, handshake, navigate],
  );

  if (!isConfigLoaded || !demoMode) return <Loader />;

  return (
    <main className="min-h-screen bg-base-200 px-4 py-28">
      <div className="mx-auto flex max-w-3xl flex-col justify-center items-center gap-8">
        <div className="flex w-full justify-end">
          <div
            className="tooltip tooltip-left w-5"
            data-tip="Mode Clair / Mode Sombre"
          >
            <ThemeToggle />
          </div>
        </div>

        <header className="flex flex-col items-center text-center">
          <img
            className="mb-6 h-auto w-56 object-contain"
            src={theme === "light" ? logoLightMode : logoDarkMode}
            alt="logo ANDRIA"
          />
          <h1 className="text-3xl font-extrabold">Découvrir ANDRIA</h1>
          <p className="mt-3 text-base-content/70">
            Explorez la plateforme avec des données de démonstration.
          </p>
        </header>

        <DemoCaptcha
          progress={progress}
          isSolved={Boolean(solution)}
          error={captchaError}
          onRetry={() => setAttempt((current) => current + 1)}
        />

        {error && (
          <div className="alert alert-error" role="alert">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid w-full gap-4 sm:grid-cols-2">
          {PROFILES.map(({ profile, label, description, icon: Icon }) => (
            <button
              key={profile}
              type="button"
              className="card cursor-pointer border border-base-300 bg-base-100 p-6 text-left transition hover:border-primary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!solution || Boolean(pending)}
              onClick={() => void enterDemo(profile)}
            >
              <Icon className="h-8 w-8 text-primary" />
              <h2 className="mt-4 text-lg font-bold">{label}</h2>
              <p className="mt-2 text-sm text-base-content/70">{description}</p>
              <span className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                {pending === profile && (
                  <span className="loading loading-spinner loading-xs" />
                )}
                Entrer dans la démonstration
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
};

export default DemoEntry;
