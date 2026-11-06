import { useState, type PropsWithChildren } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "../../../../utils/cn";

type Props = PropsWithChildren<{
  title: string;
  /** Aperçu discret du contenu ; indique aussi que la section est facultative. */
  hint?: string;
  /** Ouvre la section d'emblée, par exemple lorsqu'elle contient déjà des valeurs. */
  defaultOpen?: boolean;
  /** Maintient la section ouverte tant qu'un champ qu'elle contient est en erreur. */
  hasError?: boolean;
  className?: string;
}>;

/**
 * Section repliable pour les champs facultatifs : elle garde le formulaire
 * court sans retirer l'accès aux informations complémentaires.
 */
const UserFormOptionalSection = ({
  title,
  hint,
  defaultOpen = false,
  hasError = false,
  className,
  children,
}: Props) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <details
      open={isOpen || hasError}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      className={cn(
        "group relative h-fit min-w-0 rounded-lg border border-base-300 bg-base-200 shadow-sm",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
        <span className="flex min-w-0 flex-col">
          <h2 className="text-xl font-bold">{title}</h2>
          {hint ? <span className="text-sm text-base-content/70">{hint}</span> : null}
        </span>
        <ChevronDown
          className="size-5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="@container flex flex-col gap-y-4 px-5 pb-5">{children}</div>
    </details>
  );
};

export default UserFormOptionalSection;
