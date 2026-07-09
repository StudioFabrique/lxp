import { useEffect, useRef } from "react";
import { UseFormWatch } from "react-hook-form";
import { autoSubmitTimer } from "../config/auto-submit-timer";

const useAutoSave = (
  watch: UseFormWatch<any>,
  onSave: () => void,
) => {
  const isDirty = useRef(false);

  useEffect(() => {
    const subscription = watch(() => {
      isDirty.current = true;
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty.current) {
        isDirty.current = false;
        onSave();
      }
    }, autoSubmitTimer);

    return () => clearInterval(interval);
  }, [onSave]);
};

export default useAutoSave;
