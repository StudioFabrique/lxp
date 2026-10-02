import toast from "react-hot-toast";
import type { FieldErrors, FieldValues } from "react-hook-form";

export function showFormErrors<T extends FieldValues>(errors: FieldErrors<T>) {
  const findMessage = (value: unknown): string | undefined => {
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    if (typeof record.message === "string") return record.message;
    for (const [key, child] of Object.entries(record)) {
      if (key === "ref") continue;
      const message = findMessage(child);
      if (message) return message;
    }
  };
  toast.error(findMessage(errors) ?? "Vérifiez les champs du formulaire.");
}
