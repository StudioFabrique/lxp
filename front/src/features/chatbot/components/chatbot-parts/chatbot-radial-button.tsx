import type { ReactNode } from "react";

type Props = { label: string; icon?: ReactNode; onClick: () => void };

/** Pilule d'une question de l'éventail, au même style que celles de l'onboarding. */
export default function ChatbotRadialButton({ label, icon, onClick }: Props) {
  return (
    <button
      type="button"
      className="btn btn-primary h-auto min-h-11 w-full gap-2 whitespace-normal rounded-full border border-primary-content/40 px-4 py-3 text-sm font-normal shadow-md"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
