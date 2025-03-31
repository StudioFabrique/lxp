import { ArrowUpRight, Check, Edit3 } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

type LessonItemProps = {
  lesson: Lesson;
  moduleId: number;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
};

// Composant représentant un élément de leçon individuel
const LessonItem = ({
  lesson,
  moduleId,
  selectedLesson,
  setSelectedLesson,
}: LessonItemProps) => {
  // Vérifie si cette leçon est actuellement sélectionnée
  const isLessonSelected = selectedLesson?.id === lesson.id;
  const lessonRef = useRef<HTMLDivElement>(null);

  // Vérifie si cette leçon a déjà été lue entièrement et finie
  const isLessonRead =
    lesson.lessonsRead &&
    lesson.lessonsRead?.some((lessonRead) => lessonRead.finishedAt);

  // Gestionnaire pour commencer/arrêter la lecture d'une leçon
  const handleBeginReadLesson = () => {
    setSelectedLesson(isLessonSelected ? undefined : lesson);
  };

  useEffect(() => {
    if (isLessonSelected && lessonRef.current) {
      lessonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isLessonSelected]);

  return (
    // Conteneur principal avec style conditionnel basé sur la sélection
    <div
      ref={lessonRef}
      onClick={handleBeginReadLesson}
      className={`flex items-center justify-between gap-1 rounded-xl px-4 h-14 w-full cursor-pointer hover:bg-primary/80 group ${
        isLessonSelected
          ? "bg-primary text-base-100"
          : "bg-primary/60 text-primary-content"
      }`}
    >
      <motion.span
        className="flex gap-1 items-center min-w-0 tooltip tooltip-bottom"
        animate={{
          x: isLessonSelected && !isLessonRead ? 10 : 0,
        }}
        transition={{ duration: 0.3 }}
        data-tip={lesson.title}
      >
        <p className="max-h-14 truncate" data-tip={lesson.title}>
          {lesson.title}
        </p>
        <Can action="update" object="lesson">
          <Link
            to={`/admin/lesson/edit-lesson/${lesson.id}`}
            state={{ moduleId: moduleId }}
            className="btn btn-sm px-2 btn-ghost w-fit hover:bg-primary hover:text-base-100"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </Can>
      </motion.span>

      <div className="flex h-full items-center py-3">
        {/* Affiche une coche si la leçon est lue, ou une flèche sinon */}
        {isLessonRead ? (
          <Check
            className={`w-5 h-5 p-1 rounded-full stroke-3 ${isLessonSelected ? "bg-info stroke-info-content" : "bg-success stroke-success-content"}`}
          />
        ) : (
          !isLessonSelected && (
            <div className="self-start opacity-0 group-hover:opacity-100 group-hover:animate-pulse">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LessonItem;
