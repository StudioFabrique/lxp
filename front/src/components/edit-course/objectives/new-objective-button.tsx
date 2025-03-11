// Import des composants et icônes nécessaires
import QuestionMarkTooltip from "../../UI/question-mark-tooltip/question-mark-tooltip";
import { Info } from "lucide-react";

// Props du composant
type Props = {
  toggleForm: boolean; // Contrôle l'affichage du formulaire
  setToggleForm: () => void; // Fonction pour basculer l'affichage du formulaire
};

/**
 * Composant bouton pour créer un nouvel objectif
 * Affiche un bouton qui permet de basculer l'affichage du formulaire de création d'objectif
 * Inclut une icône d'information avec une infobulle explicative
 */
function NewObjectiveButton(props: Props) {
  return (
    <>
      {/* Bouton principal qui bascule l'affichage du formulaire */}
      <button
        className="text-primary text-xs underline"
        onClick={props.setToggleForm}
      >
        {!props.toggleForm ? "Créer un nouvel objectif" : null}
      </button>
      {/* Affiche l'infobulle uniquement quand le formulaire est caché */}
      {!props.toggleForm ? (
        <QuestionMarkTooltip
          tooltipValue="Vous pouvez créer un nouvel objectif d'apprentissage pour ce cours."
          tooltipPosition="top"
        >
          <Info className="w-4 h-4 text-primary" />
        </QuestionMarkTooltip>
      ) : null}
    </>
  );
}

export default NewObjectiveButton;
