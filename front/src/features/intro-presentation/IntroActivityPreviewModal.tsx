import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import TiptapEditor from "../../components/tiptap-editor/tiptapEditor";
import ActivityPreview from "../module-preview/components/preview/activity-preview";
import {
  INTRO_IMAGE_SAMPLE,
  INTRO_RESOURCE_SAMPLE,
  INTRO_TEXT_SAMPLE,
  INTRO_VIDEO_SAMPLE,
  type IntroActivityKind,
} from "./intro-activity-samples";

type Props = {
  /** Type d'activité à montrer ; absent, la fenêtre est fermée. */
  kind: IntroActivityKind | null;
  title: string;
  onClose: () => void;
};

/** Aperçu d'un type d'activité avec les composants réellement utilisés dans les modules. */
const IntroActivityPreviewModal = ({ kind, title, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (kind && !dialog.open) dialog.showModal();
    if (!kind && dialog.open) dialog.close();
  }, [kind]);

  return (
    <dialog ref={dialogRef} className="modal" onClose={onClose} aria-label={`Aperçu : ${title}`}>
      <div className="modal-box w-11/12 max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Fermer l'aperçu" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <p className="mt-1 text-sm text-base-content/70">Exemple de contenu : voici ce que verront vos apprenants.</p>
        {kind ? (
          <div className="mt-4">
            {kind === "text" ? <TiptapEditor mode="read" initialValue={INTRO_TEXT_SAMPLE} /> : null}
            {kind === "video" ? <ActivityPreview activity={INTRO_VIDEO_SAMPLE} /> : null}
            {kind === "image" ? (
              <img src={INTRO_IMAGE_SAMPLE.src} alt={INTRO_IMAGE_SAMPLE.alt} className="mx-auto max-h-[60vh] rounded-box" />
            ) : null}
            {kind === "resource" ? <ActivityPreview activity={INTRO_RESOURCE_SAMPLE} /> : null}
          </div>
        ) : null}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="submit" aria-label="Fermer l'aperçu">fermer</button>
      </form>
    </dialog>
  );
};

export default IntroActivityPreviewModal;
