import { BookOpenCheck, GraduationCap, Sparkles, X } from "lucide-react";

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
      className="modal modal-open z-[2100]"
      aria-labelledby="onboarding-welcome-title"
    >
      <div className="modal-box max-w-2xl overflow-hidden p-0">
        <div className="bg-primary px-7 py-8 text-primary-content">
          <div className="mb-5 flex items-start justify-between gap-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-content/15">
              {isAdmin ? <GraduationCap /> : <BookOpenCheck />}
            </span>
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
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide opacity-80">
            <Sparkles className="h-4 w-4" /> Bienvenue sur Andria
          </p>
          <h2 id="onboarding-welcome-title" className="text-3xl font-bold">
            {isAdmin
              ? "Créons votre premier contenu ensemble"
              : "Découvrez votre espace d’apprentissage"}
          </h2>
        </div>

        <div className="space-y-5 px-7 py-6">
          <p className="text-base-content/75">
            {isAdmin
              ? "Ce guide vous accompagne de la création d’une formation jusqu’à votre première activité avec l’éditeur de texte. Vous saisissez vos propres informations : le tutoriel se contente de vous guider."
              : "Ce rapide tour vous montre où retrouver vos parcours, reprendre une activité et suivre votre progression."}
          </p>
          <div className="rounded-xl border border-base-300 bg-base-200 p-4 text-sm">
            <p className="font-semibold">Vous gardez toujours le contrôle</p>
            <p className="mt-1 text-base-content/65">
              Vous pouvez revenir en arrière ou arrêter le tutoriel à tout
              moment. Il pourra être relancé depuis le menu latéral.
            </p>
          </div>
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
              {isSaving && <span className="loading loading-spinner loading-sm" />}
              Commencer le tutoriel
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default OnboardingWelcome;
