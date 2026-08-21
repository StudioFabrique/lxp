import { X } from "lucide-react";

type Props = {
  onCancel: () => void;
  onConfirm: () => void;
};

const DemoExitConfirmation = ({ onCancel, onConfirm }: Props) => (
  <div
    className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-950/70 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="demo-exit-title"
  >
    <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 text-base-content shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <h2 id="demo-exit-title" className="text-lg font-bold">
          Quitter la démonstration ?
        </h2>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-circle"
          onClick={onCancel}
          aria-label="Rester dans la démonstration"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-base-content/70">
        Vous serez redirigé hors de la démonstration. Vous pourrez y revenir à
        tout moment.
      </p>

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onCancel}
          autoFocus
        >
          Rester
        </button>
        <button
          type="button"
          className="btn btn-warning btn-sm"
          onClick={onConfirm}
        >
          Quitter
        </button>
      </div>
    </div>
  </div>
);

export default DemoExitConfirmation;
