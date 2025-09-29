import { Check, Ellipsis } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type LessonItemProps = {
  lesson: Lesson;
  moduleId: number;
  lessonsOrders: number[];
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
};

// Composant représentant un élément de leçon individuel
const LessonItem = ({
  lesson,
  moduleId,
  lessonsOrders,
  selectedLesson,
  setSelectedLesson,
}: LessonItemProps) => {
  // Vérifie si cette leçon est actuellement sélectionnée
  const isLessonSelected = selectedLesson?.id === lesson.id;
  const lessonRef = useRef<HTMLDivElement>(null);

  // Vérifie si cette leçon a déjà été lue entièrement et finie
  const isLessonRead = lesson.lessonsRead?.some(
    (lessonRead) => lessonRead.finishedAt
  );

  // Gestionnaire pour commencer/arrêter la lecture d'une leçon
  const handleBeginReadLesson = () => {
    if (!isLessonSelected) setSelectedLesson(lesson);
  };

  useEffect(() => {
    if (isLessonSelected) {
      if (
        lessonRef.current &&
        selectedLesson?.order !== Math.min(...lessonsOrders)
      ) {
        lessonRef.current.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [isLessonSelected, lessonsOrders, selectedLesson]);

  return (
    // Conteneur principal avec style conditionnel basé sur la sélection
    <div
      ref={lessonRef}
      onClick={handleBeginReadLesson}
      onKeyDown={handleBeginReadLesson}
      className={`flex items-center justify-between gap-1 rounded-xl px-4 h-14 w-full cursor-pointer group ${
        isLessonSelected
          ? "bg-accent text-accent-content hover:bg-accent/80"
          : "bg-primary text-primary-content hover:bg-primary/80"
      }`}
    >
      <motion.span
        className="flex gap-1 justify-between items-center min-w-0 w-full"
        animate={{
          x: isLessonSelected && !isLessonRead ? 10 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <p className="max-h-14 truncate text-sm" data-tip={lesson.title}>
          {lesson.title}
        </p>
        <Can action="update" object="lesson">
          <Link
            to={`/admin/lesson/edit-lesson/${lesson.id}`}
            state={{ moduleId: moduleId }}
            className="btn btn-sm px-2 btn-ghost w-fit hover:bg-transparent hover:text-base-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis className="w-4 h-4" />
          </Link>
        </Can>
      </motion.span>

      {/* Affiche une coche si la leçon est lue, ou une flèche sinon */}
      {isLessonRead && (
        <Check
          className={`w-5 h-5 p-1 rounded-full stroke-3 ${
            isLessonSelected
              ? "bg-secondary stroke-secondary-content"
              : "bg-success stroke-success-content"
          }`}
        />
      )}
    </div>
  );
};

export default LessonItem;
