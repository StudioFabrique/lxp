import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

type RatingPanelProps = {
  selectedStars: number;
  handleStarClick: (rating: number) => void;
  handleEvaluateContent: () => void;
  note?: number;
  onClose: () => void;
};

/**
 * Composant pour afficher le panneau d'évaluation avec les étoiles
 * @param selectedStars - Nombre d'étoiles sélectionnées
 * @param handleStarClick - Fonction appelée lors du clic sur une étoile
 * @param handleEvaluateContent - Fonction pour valider l'évaluation
 * @param note - Note existante (optionnelle)
 * @param onClose - Fonction pour fermer le panneau
 */
const RatingPanel = ({
  selectedStars,
  handleStarClick,
  handleEvaluateContent,
  note,
  onClose,
}: RatingPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Surveillance des événements suivants :
  // Action de l'utilisateur :
  // - Scroll
  // - Click à l'exterieur du composant
  // - Appuie sur la touche "Escape" (échap en clavier français)
  // Ensuite, fermeture automatique du composant
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleScroll = () => {
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="absolute left-[-30%] top-0 transform -translate-y-full card w-64 bg-base-100 border-[1px] border-primary shadow-2xl z-50 rounded-lg"
    >
      <div className="card-body p-6">
        <h3 className="text-lg font-semibold mb-2">Votre évaluation</h3>
        <div className="flex gap-2 my-3 justify-center">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Star
              size={24}
              key={rating}
              onClick={() => handleStarClick(rating)}
              className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
                rating <= selectedStars
                  ? "fill-primary scale-105 stroke-1"
                  : "stroke-base-content/50 stroke-1 hover:stroke-1"
              }`}
            />
          ))}
        </div>

        {note && (
          <div className="text-sm text-base-content/70 border-l-4 border-primary/50 p-2 bg-base-200 rounded">
            Vous avez déjà évalué ce contenu, vous pouvez mettre à jour votre
            note
          </div>
        )}

        <div className="card-actions justify-end mt-4 space-x-2">
          <button
            className="btn btn-ghost btn-sm hover:bg-base-200"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleEvaluateContent}
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingPanel;
