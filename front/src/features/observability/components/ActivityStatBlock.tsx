import { ChevronDown } from "lucide-react";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import { cn } from "../../../utils/cn";
import { formatNumber } from "../../../utils/helpers/format-number";

type Props = {
  label: string;
  value: number;
  /** Précision sous le libellé (« 2 personnes différentes »). */
  hint?: string;
  unit?: string;
  selected: boolean;
  /** Identifiant du panneau de détail ouvert par ce bloc. */
  controls: string;
  /** Reçoit le bouton cliqué pour que la page puisse y revenir à la fermeture du détail. */
  onSelect: (button: HTMLButtonElement) => void;
  /** Classe de couleur sémantique du chiffre ; `text-primary` par défaut. */
  valueClassName?: string;
};

/**
 * Gros bloc de statistique, au format des totaux de la liste d'utilisateurs.
 * Il ouvre le détail correspondant : l'appel à l'action est écrit dans le bloc
 * et le bouton couvre toute sa surface.
 */
export default function ActivityStatBlock({
  label,
  value,
  hint,
  unit,
  selected,
  controls,
  onSelect,
  valueClassName = "text-primary",
}: Readonly<Props>) {
  const formatted = `${formatNumber(value)}${unit ? ` ${unit}` : ""}`;

  return (
    <BoxWrapper
      className={cn(
        "min-h-32 justify-between gap-2 p-4 font-bold text-primary transition-shadow hover:bg-base-100 hover:shadow-md",
        selected && "bg-base-100 ring-2 ring-primary",
      )}
    >
      <button
        type="button"
        onClick={(event) => onSelect(event.currentTarget)}
        aria-pressed={selected}
        aria-controls={controls}
        aria-label={`${label} : ${formatted}. ${selected ? "Masquer" : "Afficher"} le détail`}
        className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      />
      <div aria-hidden="true" className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-base">{label}</p>
          {hint && <p className="text-xs font-normal text-base-content/70">{hint}</p>}
        </div>
        <p className={cn("shrink-0 text-4xl lg:text-5xl", valueClassName)}>
          {formatNumber(value)}
          {unit && <span className="ml-1 text-lg">{unit}</span>}
        </p>
      </div>
      <p aria-hidden="true" className="flex items-center gap-1 text-xs font-semibold">
        {selected ? "Masquer le détail" : "Voir le détail"}
        <ChevronDown
          className={cn("size-4 transition-transform", selected && "rotate-180")}
        />
      </p>
    </BoxWrapper>
  );
}
