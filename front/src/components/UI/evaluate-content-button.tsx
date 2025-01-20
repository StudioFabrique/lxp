import { useState } from "react";
import Modal from "./modal/modal";
import { Star } from "lucide-react";

type EvaluateContentButton = {
  note?: number;
  sendEvaluation: (note: number) => void;
};

// Bouton accompagné d'une modal pour envoyer une note de 1 à 5 à l'aide d'étoiles
const EvaluateContentButton = ({
  note,
  sendEvaluation,
}: EvaluateContentButton) => {
  const [modalEnabled, setModalEnabled] = useState<boolean>(false);
  const [selectedStars, setSelectedStars] = useState<number>(note || 3);

  const handleSwitchModalState = () => {
    setModalEnabled((prevState) => !prevState);
  };

  const handleEvaluateContent = () => {
    sendEvaluation(selectedStars);
    handleSwitchModalState();
  };

  const handleStarClick = (rating: number) => {
    setSelectedStars(rating);
  };

  return (
    <div>
      {modalEnabled ? (
        <Modal
          title="Évaluez ce contenu"
          leftLabel="Annuler"
          rightLabel="Confirmer"
          onLeftClick={handleSwitchModalState}
          onRightClick={handleEvaluateContent}
          modalBoxStyle="flex flex-col gap-2"
        >
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Star
                key={rating}
                onClick={() => handleStarClick(rating)}
                className={`cursor-pointer ${
                  rating <= selectedStars ? "fill-yellow-400" : ""
                }`}
              />
            ))}
          </div>
          {note ? (
            <div>
              Vous avez déjà évalué ce contenu, vous pouvez mettre à jour votre
              note
            </div>
          ) : null}
        </Modal>
      ) : null}
      <button className="btn btn-outline" onClick={handleSwitchModalState}>
        Évaluer ce contenu
      </button>
    </div>
  );
};

export default EvaluateContentButton;
