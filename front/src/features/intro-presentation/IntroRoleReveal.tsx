import { useContext, useEffect, useRef, useState } from "react";
import { SkipForward } from "lucide-react";

import { AuthContext } from "../../store/AuthProvider";
import { useIntroPresentation } from "./useIntroPresentation";
import { prefersReducedMotion } from "./intro-motion";
import IntroRoleDetection from "./IntroRoleDetection";
import IntroStudentSpace from "./IntroStudentSpace";
import IntroTeamSpace from "./IntroTeamSpace";
import { findIntroRole, getIntroSpace } from "./intro-role";
import { buildInitials } from "./intro-space-content";

type Props = {
  onDone: () => void;
};

type Step = "detection" | "leaving" | "space";

/** Durée de la sortie de la barre latérale (voir `AppWrapper`). */
const SIDEBAR_EXIT_MS = 700;

/**
 * Enchaînement qui suit la présentation (terminée ou ignorée) : détection du
 * rôle, puis construction de l'interface de l'espace correspondant.
 */
const IntroRoleReveal = ({ onDone }: Props) => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState<Step>("detection");
  const { setSidebarExit } = useIntroPresentation();
  const rootRef = useRef<HTMLElement>(null);
  const role = findIntroRole(user?.roles);

  // Sans rôle connu, il n'y a rien à présenter.
  useEffect(() => {
    if (!role) onDone();
  }, [role, onDone]);

  // La présentation qui était affichée vient de disparaître : le focus passe ici.
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  // La barre latérale est repoussée hors de l'écran avant que la séquence ne démarre.
  useEffect(() => {
    if (step !== "leaving") return;
    setSidebarExit("leaving");
    const timer = setTimeout(
      () => {
        setSidebarExit("gone");
        setStep("space");
      },
      prefersReducedMotion() ? 0 : SIDEBAR_EXIT_MS,
    );
    return () => clearTimeout(timer);
  }, [step, setSidebarExit]);

  if (!role) return null;

  return (
    <section
      ref={rootRef}
      tabIndex={-1}
      aria-label="Découverte de votre espace"
      className="absolute inset-0 overflow-hidden bg-base-100 outline-none"
    >
      {step === "detection" ? (
        <IntroRoleDetection
          role={role}
          initials={buildInitials({ firstname: user?.firstname, lastname: user?.lastname })}
          onDone={() => setStep("leaving")}
        />
      ) : null}
      {/* Monté dès la détection : le dashboard du rôle se charge pendant l'animation. */}
      {getIntroSpace(role) === "student" ? (
        <IntroStudentSpace role={role} isPlaying={step === "space"} onEnded={onDone} />
      ) : (
        <IntroTeamSpace role={role} isPlaying={step === "space"} onEnded={onDone} />
      )}
      <button
        type="button"
        className="btn btn-ghost btn-sm absolute bottom-4 left-4 z-10"
        onClick={onDone}
      >
        <SkipForward className="size-4" aria-hidden="true" />
        Passer
      </button>
    </section>
  );
};

export default IntroRoleReveal;
