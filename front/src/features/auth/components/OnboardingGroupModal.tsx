import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { OnboardingOverlayContext } from "./onboarding-overlay-context";
import { X } from "lucide-react";

export default function OnboardingGroupModal({ title, onClose, children }: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [overlayContainer, setOverlayContainer] = useState<HTMLDialogElement | null>(null);
  const attachDialog = useCallback((element: HTMLDialogElement | null) => {
    dialog.current = element;
    setOverlayContainer(element);
  }, []);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);

  return createPortal(
    <dialog ref={attachDialog} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden border-0 bg-transparent p-4 text-base-content outline-none open:flex open:items-center open:justify-center backdrop:bg-neutral/40" aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="flex max-h-[calc(100dvh-2rem)] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-base-100 p-6 shadow-xl">
        <div className="mb-5 flex shrink-0 items-center justify-between gap-3">
          <h2 id={titleId} className="text-lg font-bold">{title}</h2>
          <button type="button" className="btn btn-ghost btn-sm" aria-label="Fermer" onClick={onClose}>
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <OnboardingOverlayContext.Provider value={overlayContainer}>{children}</OnboardingOverlayContext.Provider>
      </div>
    </dialog>, document.body,
  );
}
