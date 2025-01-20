import { HelpCircle } from "lucide-react";

/**
 * Props pour le composant QuestionMarkTooltip
 * @typedef QuestionMarkTooltipProps
 * @property {string} [tooltipValue] - Le texte à afficher dans l'infobulle
 * @property {React.ReactNode} [children] - Le contenu à afficher à la place de l'icône par défaut
 * @property {"right" | "left" | "top" | "bottom"} [tooltipPosition="right"] - La position de l'infobulle par rapport à l'icône
 */
type QuestionMarkTooltipProps = {
  tooltipValue?: string;
  children?: React.ReactNode;
  tooltipPosition?: "right" | "left" | "top" | "bottom";
};

/**
 * Composant qui affiche une icône d'aide avec une infobulle au survol
 * @param {QuestionMarkTooltipProps} props - Les props du composant
 * @returns {JSX.Element} Le composant QuestionMarkTooltip
 */
const QuestionMarkTooltip = ({
  children,
  tooltipValue,
  tooltipPosition = "right",
}: QuestionMarkTooltipProps) => {
  // Construit la classe CSS pour la position de l'infobulle
  const position = "tooltip tooltip-" + tooltipPosition;

  return (
    <div className={position} data-tip={tooltipValue}>
      {/* Affiche soit le contenu personnalisé, soit l'icône d'aide par défaut */}
      {children ? (
        children
      ) : (
        <HelpCircle className="w-4 h-4 stroke-base-content/60" />
      )}
    </div>
  );
};

export default QuestionMarkTooltip;
