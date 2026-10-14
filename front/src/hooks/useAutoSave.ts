import { useEffect, useRef } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";
import { autoSaveBlurDelay } from "../config/auto-submit-timer";

/**
 * Enregistre les modifications d'un formulaire peu après la perte de focus d'un
 * champ (et non à chaque frappe). Un nouveau focus perdu repousse l'échéance ;
 * à la fermeture de l'écran, une modification en attente est enregistrée
 * immédiatement. Si l'enregistrement échoue, la modification reste en attente
 * pour la prochaine perte de focus.
 */
export default function useAutoSave<T extends FieldValues>(watch: UseFormWatch<T>, onSave: () => Promise<void>, enabled = true) {
  const revision = useRef(0);
  const savedRevision = useRef(0);
  const running = useRef(false);
  const saveRef = useRef(onSave);
  saveRef.current = onSave;
  useEffect(() => {
    const subscription = watch((_values, event) => {
      if (event.name) revision.current += 1;
    });
    return () => subscription.unsubscribe();
  }, [watch]);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const saveIfPending = async () => {
      if (running.current || revision.current === savedRevision.current) return;
      const current = revision.current;
      running.current = true;
      try {
        await saveRef.current();
        if (active) savedRevision.current = current;
      } catch {
        // La modification reste en attente pour une nouvelle tentative.
      } finally { running.current = false; }
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const handleFocusOut = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        void saveIfPending();
      }, autoSaveBlurDelay);
    };
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusout", handleFocusOut);
      if (timer !== undefined) {
        clearTimeout(timer);
        void saveIfPending();
      }
      active = false;
    };
  }, [enabled]);
}
