import { useEffect, useRef } from "react";
import type { FieldValues, UseFormWatch } from "react-hook-form";
import { autoSubmitTimer } from "../config/auto-submit-timer";

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
    const timer = setInterval(async () => {
      if (running.current || revision.current === savedRevision.current) return;
      const current = revision.current;
      running.current = true;
      try {
        await saveRef.current();
        if (active) savedRevision.current = current;
      } catch {
        // La modification reste en attente pour une nouvelle tentative.
      } finally { running.current = false; }
    }, autoSubmitTimer);
    return () => { active = false; clearInterval(timer); };
  }, [enabled]);
}
