import { useState } from "react";
import RatingPanel from "./rating-panel";

type EvaluateContentButtonProps = {
  note?: number;
  onRateContent: (note: number) => void;
};

/**
 * Bouton permettant d'évaluer un contenu avec un système d'étoiles
 * @param note - Note existante (optionnelle)
 * @param sendEvaluation - Fonction appelée pour envoyer l'évaluation
 */
const EvaluateContentButton = ({
  note,
  onRateContent,
}: EvaluateContentButtonProps) => {
  // État pour gérer l'ouverture/fermeture du panneau
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  // État pour stocker le nombre d'étoiles sélectionnées
  const [selectedStars, setSelectedStars] = useState<number>(note || 3);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  // ferme l'affichage du panneau
  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  // Envoie l'évaluation et ferme le panneau après un délai
  const handleRatingContent = () => {
    onSendRating(selectedStars);
    setTimeout(() => {
      handleClosePanel();
    }, 1000);
  };

  // Met à jour le nombre d'étoiles sélectionnées
  const handleStarClick = (rating: number) => {
    setSelectedStars(rating);
  };

  return (
    <div className="relative">
      <RatingPanel
        selectedStars={selectedStars}
        handleStarClick={handleStarClick}
        onRateContent={onRateContent}
        note={note}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />
      <button className="btn btn-outline" onClick={handleOpenPanel}>
        Évaluer ce contenu
      </button>
    </div>
  );
};

export default EvaluateContentButton;
