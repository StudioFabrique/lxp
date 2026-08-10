import { CircleHelp, X } from "lucide-react";

type Props = {
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const OnboardingStopConfirmation = ({
  isSaving,
  onCancel,
  onConfirm,
}: Props) => (
  <div
    className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/70 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="onboarding-stop-title"
  >
    <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 text-base-content shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-warning/15 p-2 text-warning">
            <CircleHelp className="h-5 w-5" />
          </span>
          <h2 id="onboarding-stop-title" className="text-lg font-bold">
            Arrêter le tutoriel ?
          </h2>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle"
          onClick={onCancel}
          disabled={isSaving}
          aria-label="Continuer le tutoriel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-base-content/70">
        Votre progression dans le guide sera interrompue. Vous pourrez le
        relancer à tout moment depuis la barre latérale.
      </p>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onCancel}
          disabled={isSaving}
          autoFocus
        >
          Continuer le tutoriel
        </button>
        <button
          type="button"
          className="btn btn-warning btn-sm"
          onClick={onConfirm}
          disabled={isSaving}
        >
          {isSaving && <span className="loading loading-spinner loading-xs" />}
          Arrêter
        </button>
      </div>
    </div>
  </div>
);

export default OnboardingStopConfirmation;
