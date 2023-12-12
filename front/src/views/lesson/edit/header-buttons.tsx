import { useNavigate } from "react-router-dom";

interface HeaderButtonProps {
  lessonId: number;
  showPreview: boolean;
  onPublish: () => void;
}

export default function HeaderButton({
  showPreview,
  onPublish,
}: HeaderButtonProps) {
  const nav = useNavigate();

  const btnStyle = "btn btn-sm btn-primary";

  const handlePreview = () => {
    nav("#");
  };

  const previewTooltip = showPreview
    ? "Affiche l'aperçu de la leçon"
    : "La leçon ne contient aucune activité à pévisualiser";
  const publishTooltip = showPreview
    ? "Rend la leçon disponible au public"
    : "La leçon n'a aucun contenu à publier";

  return (
    <div className="flex items-center gap-x-4">
      <div className="tooltip" data-tip={previewTooltip}>
        <button
          className={btnStyle}
          disabled={!showPreview}
          onClick={handlePreview}
        >
          Aperçu
        </button>
      </div>
      <div className="tooltip" data-tip={publishTooltip}>
        <button
          className={btnStyle}
          disabled={!showPreview}
          onClick={onPublish}
        >
          Publier
        </button>
      </div>
    </div>
  );
}
