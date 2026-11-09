import type { ReactNode } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  /** `secondary` distingue les entrées de navigation (« Autres questions ») des questions. */
  variant?: "primary" | "secondary";
};

/** Fond clair et texte `primary` : contraste contrôlé par les thèmes, là où `btn-secondary` varie d'un thème à l'autre. */
export const SECONDARY_CLASS = "border-primary bg-base-100 text-primary hover:bg-base-200";

/** Pilule d'une question de l'éventail, au même style que celles de l'onboarding. */
export default function ChatbotRadialButton({ label, icon, onClick, variant = "primary" }: Props) {
  return (
    <button
      type="button"
      className={cn(
        "btn h-auto min-h-11 w-full gap-2 whitespace-normal rounded-full border px-4 py-3 text-sm font-normal shadow-md",
        variant === "secondary" ? SECONDARY_CLASS : "btn-primary border-primary-content/40",
      )}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
