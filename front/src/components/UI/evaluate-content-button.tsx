import { useState } from "react";
import RatingPanel from "./rating-panel";

type EvaluateContentButton = {
  note?: number;
  sendEvaluation: (note: number) => void;
};

/**
 * Bouton permettant d'évaluer un contenu avec un système d'étoiles
 * @param note - Note existante (optionnelle)
 * @param sendEvaluation - Fonction appelée pour envoyer l'évaluation
 */
const EvaluateContentButton = ({
  note,
  sendEvaluation,
}: EvaluateContentButton) => {
  // État pour gérer l'ouverture/fermeture du panneau
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  // État pour stocker le nombre d'étoiles sélectionnées
  const [selectedStars, setSelectedStars] = useState<number>(note || 3);

  // Bascule l'affichage du panneau
  const handleTogglePanel = () => {
    setIsPanelOpen((prevState) => !prevState);
  };

  // Envoie l'évaluation et ferme le panneau
  const handleEvaluateContent = () => {
    sendEvaluation(selectedStars);
    handleTogglePanel();
  };

  // Met à jour le nombre d'étoiles sélectionnées
  const handleStarClick = (rating: number) => {
    setSelectedStars(rating);
  };

  return (
    <div className="relative">
      {isPanelOpen && (
        <RatingPanel
          selectedStars={selectedStars}
          handleStarClick={handleStarClick}
          handleEvaluateContent={handleEvaluateContent}
          note={note}
          onClose={handleTogglePanel}
        />
      )}
      <button className="btn btn-outline mt-4" onClick={handleTogglePanel}>
        Évaluer ce contenu
      </button>
    </div>
  );
};

export default EvaluateContentButton;
