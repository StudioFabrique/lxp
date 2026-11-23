import {
  useEffect,
  useRef,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { cn } from "../../../utils/cn";
import { formatNumber } from "../../../utils/helpers/format-number";
import { scrollToElementTop } from "../helpers/scroll-to-element";

type Props = {
  title: string;
  /** Nombre d'éléments, affiché dans l'en-tête. */
  count?: number;
  defaultOpen?: boolean;
  /** Section imbriquée dans un bloc déjà encadré : fond plus léger. */
  nested?: boolean;
  /** Aperçu visible tant que la section est repliée, pour qu'elle ne paraisse pas vide. */
  preview?: ReactNode;
  /** Libellé du bouton qui déplie la section sous l'aperçu. */
  expandLabel?: string;
};

/**
 * Section repliable DaisyUI (`details` / `summary`) : le clavier et les
 * technologies d'assistance disposent du comportement natif. L'aperçu est un
 * frère du `details` : le style `collapse` masque tout ce que contient
 * l'élément replié, aperçu compris.
 */
export default function CollapsibleSection({
  title,
  count,
  defaultOpen = false,
  nested = false,
  preview,
  expandLabel,
  children,
}: PropsWithChildren<Props>) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const cancelScrollRef = useRef<() => void>(() => {});

  // Une fois ouverte, la section remonte à la hauteur de son titre : son contenu
  // commence à l'écran, sans défilement manuel.
  const scrollToTop = () => {
    cancelScrollRef.current();
    cancelScrollRef.current = scrollToElementTop(cardRef.current);
  };

  useEffect(() => () => cancelScrollRef.current(), []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "min-w-0 scroll-mt-28 rounded-lg border border-base-300 shadow-sm",
        nested ? "bg-base-100/60" : "bg-base-200",
      )}
    >
      {/* Sans transition : l'aperçu disparaît tout de suite, et un contenu qui se déplierait en s'animant
          raccourcirait la page un instant, ce qui ramène le défilement vers le haut. */}
      <details
        ref={detailsRef}
        open={defaultOpen}
        className="collapse collapse-arrow transition-none [&_.collapse-content]:transition-none"
      >
        <summary
          className="collapse-title flex items-center gap-2 text-lg font-bold"
          onClick={() => {
            // `open` n'a pas encore basculé : la section est en train de s'ouvrir.
            if (detailsRef.current && !detailsRef.current.open) scrollToTop();
          }}
        >
          {title}
          {count !== undefined && (
            <span className="badge badge-ghost">{formatNumber(count)}</span>
          )}
        </summary>
        <div className="collapse-content">{children}</div>
      </details>
      {preview && (
        <div className="flex flex-col gap-2 px-4 pb-4 [details[open]~&]:hidden">
          {preview}
          {expandLabel && (
            <button
              type="button"
              className="btn btn-ghost btn-sm self-center"
              onClick={() => {
                const details = detailsRef.current;
                if (!details) return;
                details.open = true;
                // Le bouton cliqué vient d'être masqué : le focus passe au titre
                // plutôt que de se perdre.
                details
                  .querySelector("summary")
                  ?.focus({ preventScroll: true });
                scrollToTop();
              }}
            >
              {expandLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
