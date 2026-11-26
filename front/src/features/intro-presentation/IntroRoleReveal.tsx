import { useContext, useEffect, useRef, useState } from "react";
import { SkipForward } from "lucide-react";

import { AuthContext } from "../../store/AuthProvider";
import IntroRoleDetection from "./IntroRoleDetection";
import IntroStudentSpace from "./IntroStudentSpace";
import IntroTeamSpace from "./IntroTeamSpace";
import { findIntroRole, getIntroSpace } from "./intro-role";
import { useIntroRoles } from "./useIntroRoles";

type Props = {
  onDone: () => void;
};

type Step = "detection" | "space";

/**
 * Enchaînement qui ouvre la première connexion, avant la présentation : détection
 * du rôle, puis construction de l'interface de l'espace correspondant.
 */
const IntroRoleReveal = ({ onDone }: Props) => {
  const { user } = useContext(AuthContext);
  const [step, setStep] = useState<Step>("detection");
  const rootRef = useRef<HTMLElement>(null);
  const introRoles = useIntroRoles();
  const role = findIntroRole(user?.roles, introRoles);

  // Sans rôle connu, il n'y a rien à présenter.
  useEffect(() => {
    if (!role) onDone();
  }, [role, onDone]);

  // La présentation qui était affichée vient de disparaître : le focus passe ici.
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

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
          roles={introRoles}
          onDone={() => setStep("space")}
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
