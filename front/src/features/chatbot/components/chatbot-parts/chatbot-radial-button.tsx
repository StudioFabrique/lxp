import type { ReactNode } from "react";
import { cn } from "../../../../utils/cn";

type Props = {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  /** `secondary` distingue les entrées de navigation (« Autres questions ») des questions. */
  variant?: "primary" | "secondary";
};

/** Pilule d'une question de l'éventail, au même style que celles de l'onboarding. */
export default function ChatbotRadialButton({ label, icon, onClick, variant = "primary" }: Props) {
  return (
    <button
      type="button"
      className={cn("btn h-auto min-h-11 w-full gap-2 whitespace-normal rounded-full border border-primary-content/40 px-4 py-3 text-sm font-normal shadow-md", variant === "secondary" ? "btn-secondary border-secondary-content/40" : "btn-primary")}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
