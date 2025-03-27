import { ArrowRight, Check, Edit3 } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";

type LessonItemProps = {
  lesson: Lesson;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
};

// Composant représentant un élément de leçon individuel
const LessonItem = ({
  lesson,
  selectedLesson,
  setSelectedLesson,
}: LessonItemProps) => {
  // Vérifie si cette leçon est actuellement sélectionnée
  const isLessonSelected = selectedLesson?.id === lesson.id;

  // Vérifie si cette leçon a déjà été lue entièrement et finie
  const isLessonRead =
    lesson.lessonsRead &&
    lesson.lessonsRead?.some((lessonRead) => lessonRead.finishedAt);

  // Gestionnaire pour commencer/arrêter la lecture d'une leçon
  const handleBeginReadLesson = () => {
    setSelectedLesson(isLessonSelected ? undefined : lesson);
  };

  return (
    // Conteneur principal avec style conditionnel basé sur la sélection
    <div
      onClick={handleBeginReadLesson}
      className={`flex items-center justify-between gap-1 rounded-xl p-4 w-full cursor-pointer ${
        isLessonSelected
          ? "bg-primary text-base-100"
          : "bg-primary/60 text-primary-content"
      }`}
    >
      <span className="flex gap-1 items-center min-w-0">
        <p className="max-h-14 truncate">{lesson.title}</p>
        <Can action="update" object="lesson">
          <Link
            to={`/admin/lesson/edit-lesson/${lesson.id}`}
            className="btn btn-sm px-2 btn-ghost w-fit hover:bg-primary hover:text-base-100"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </Can>
      </span>

      <div>
        {/* Affiche une coche si la leçon est lue, ou une flèche sinon */}
        {isLessonRead ? (
          <Check
            className={`w-5 h-5 p-1 rounded-full stroke-3 ${isLessonSelected ? "bg-info stroke-info-content" : "bg-success stroke-success-content"}`}
          />
        ) : (
          <ArrowRight />
        )}
      </div>
    </div>
  );
};

export default LessonItem;
