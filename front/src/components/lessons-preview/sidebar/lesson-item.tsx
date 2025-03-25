import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";

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
      <p className="max-h-14 truncate">{lesson.title}</p>

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
