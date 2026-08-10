import { X } from "lucide-react";

type Props = {
  layout: "admin" | "student";
  isSaving: boolean;
  onStart: () => void;
  onSkip: () => void;
};

const OnboardingWelcome = ({ layout, isSaving, onStart, onSkip }: Props) => {
  const isAdmin = layout === "admin";

  return (
    <dialog
      className="modal modal-open z-2100"
      aria-labelledby="onboarding-welcome-title"
    >
      <div className="modal-box max-w-2xl overflow-hidden p-0">
        <div className="bg-secondary px-7 py-8 text-primary-content">
          <div className="mb-5 flex items-start justify-between gap-5">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle text-primary-content"
              onClick={onSkip}
              disabled={isSaving}
              aria-label="Ignorer le tutoriel"
            >
              <X />
            </button>
          </div>
          <div className="mb-2 flex flex-col items-center gap-2">
            <p className="text-2xl font-semibold tracking-wide opacity-80">
              Bienvenue sur Andria
            </p>
            <h2 id="onboarding-welcome-title" className="text-xl font-bold">
              {isAdmin
                ? "Créons votre premier contenu ensemble"
                : "Découvrez votre espace d’apprentissage"}
            </h2>
          </div>
        </div>

        <div className="space-y-5 px-7 py-6">
          <p className="text-base-content/75">
            {isAdmin
              ? "Ce guide vous accompagne de la création d’une formation jusqu’à votre première activité avec l’éditeur de texte. Vous saisissez vos propres informations : le tutoriel se contente de vous guider."
              : "Ce rapide tutoriel vous montre où retrouver vos parcours, reprendre une activité et suivre votre progression."}
          </p>
          <p className="mt-1 text-sm text-info">
            Vous pouvez revenir en arrière ou arrêter le tutoriel à tout moment.
            Il pourra être relancé depuis le menu latéral.
          </p>
          <div className="flex flex-wrap justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onSkip}
              disabled={isSaving}
            >
              Plus tard
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onStart}
              disabled={isSaving}
            >
              {isSaving && (
                <span className="loading loading-spinner loading-sm" />
              )}
              Commencer le tutoriel
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default OnboardingWelcome;
