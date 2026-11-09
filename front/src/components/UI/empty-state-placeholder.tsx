import { Inbox, type LucideIcon } from "lucide-react";
import { useRef, type PropsWithChildren } from "react";

import FadeWrapper from "../wrappers/FadeWrapper";
import BoxWrapper from "../wrappers/BoxWrapper";
import CursorGlowCard from "./cursor-glow-card";
import { cn } from "../../utils/cn";
import { useFillRemainingHeight } from "../../hooks/useFillRemainingHeight";

type EmptyStatePlaceholderProps = PropsWithChildren<{
  title: string;
  /** Explique la suite à donner (« Créez votre premier groupe pour… »). */
  description?: string;
  /** Illustration liée au contenu de la page ; `Inbox` par défaut. */
  icon?: LucideIcon;
  withBorder?: boolean;
}>;

const EmptyStatePlaceholder = ({
  title,
  description,
  icon: PlaceholderIcon = Inbox,
  children,
  withBorder = true,
}: EmptyStatePlaceholderProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  // Bordure + padding du BoxWrapper (p-5) sous le contenu quand l'encadré est visible.
  useFillRemainingHeight(contentRef, withBorder ? 22 : 0);

  const placeholder = (
    <BoxWrapper
      unstyled={!withBorder}
      className={cn(withBorder ? "border border-base-300 bg-transparent" : "")}
    >
      <FadeWrapper>
        <div ref={contentRef} className="flex min-h-[50vh] flex-col items-center justify-center gap-6 text-center sm:gap-8">
          <PlaceholderIcon
            aria-hidden="true"
            className="size-20 text-primary sm:size-28"
          />
          <div className="flex w-full max-w-xl flex-col items-center gap-3">
            <p className="text-balance text-2xl font-bold text-primary">{title}</p>
            {description ? (
              <p className="text-balance text-base text-base-content/80">
                {description}
              </p>
            ) : null}
          </div>
          {children ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {children}
            </div>
          ) : null}
        </div>
      </FadeWrapper>
    </BoxWrapper>
  );

  return withBorder ? (
    <CursorGlowCard className="bg-base-200" glowSize={6}>
      {placeholder}
    </CursorGlowCard>
  ) : (
    placeholder
  );
};

export default EmptyStatePlaceholder;
