// Import des interfaces et composants nécessaires
import Lesson from "../../utils/interfaces/lesson";
import DocumentIcon from "../UI/svg/document-icon";
import EditIcon from "../UI/svg/edit-icon";
import BoxWrapper from "../wrappers/BoxWrapper";

// Interface définissant les props du composant
interface PreviewLessonsProps {
  lessons: Lesson[]; // Tableau des leçons à afficher
  onEdit: (id: number) => void; // Fonction callback pour l'édition d'une leçon
}

// Composant qui affiche une prévisualisation des leçons
const PreviewLessons = (props: PreviewLessonsProps) => {
  const { lessons } = props;

  return (
    <BoxWrapper>
      {/* En-tête avec titre et bouton d'édition */}
      <span className="w-full flex justify-between items-center">
        <h2 className="text-xl font-bold">Contenu de cours</h2>
        <div className="w-6 h-6 text-primary" onClick={() => props.onEdit(4)}>
          <EditIcon />
        </div>
      </span>

      {/* Liste des leçons */}
      <ul className="flex flex-col gap-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            {/* Card de leçon avec icône et titre */}
            <div className="w-full h-full flex items-center gap-x-4 p-5 rounded-lg bg-secondary/20">
              <div className="w-8 h-8 text-primary">
                <DocumentIcon />
              </div>
              <p className="flex-1">{lesson.title}</p>
            </div>
          </li>
        ))}
      </ul>
    </BoxWrapper>
  );
};

export default PreviewLessons;
