import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

import { cn } from "../../utils/cn";

type Props = {
  icon: LucideIcon;
  title: string;
  /** Vrai quand l’assistant virtuel est en train d'expliquer cette partie. */
  isActive?: boolean;
  /** Identifie un composant du niveau, pour que l’assistant virtuel se place à côté. */
  detailId?: string;
  className?: string;
};

/** Cadre commun aux parties d'un niveau, chacune détachée de la carte du niveau : éléments enfants, groupes, tags, objectifs... */
const IntroSectionFrame = ({
  icon: Icon,
  title,
  isActive = false,
  detailId,
  className,
  children,
}: PropsWithChildren<Props>) => (
  <section
    data-intro-detail={detailId}
    aria-label={title}
    className={cn(
      "min-w-0 rounded-2xl border border-base-300 bg-base-200 p-4 shadow-md transition-[box-shadow,border-color] duration-300",
      isActive && "border-primary shadow-lg ring-2 ring-primary/40",
      className,
    )}
  >
    <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold">
      <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
      {title}
    </h3>
    {children}
  </section>
);

export default IntroSectionFrame;
