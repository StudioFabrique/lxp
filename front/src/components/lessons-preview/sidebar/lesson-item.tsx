import { Check, Edit, Trash2, Edit3, EllipsisIcon } from "lucide-react";
import Lesson from "../../../utils/interfaces/lesson";
import { Link } from "react-router-dom";
import Can from "../../UI/can/can.component";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

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
  children,
}: PropsWithChildren<LessonItemProps>) => {
  // Vérifie si cette leçon est actuellement sélectionnée
  const isLessonSelected = selectedLesson?.id === lesson.id;
  const lessonRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Vérifie si cette leçon a déjà été lue entièrement et finie
  const isLessonRead = lesson.lessonsRead?.some(
    (lessonRead) => lessonRead.finishedAt
  );

  // Gestionnaire pour commencer/arrêter la lecture d'une leçon
  const handleBeginReadLesson = () => {
    if (!isLessonSelected) setSelectedLesson(lesson);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuOption = (action: string) => {
    console.log(`Action ${action} sur la leçon: ${lesson.title}`);
    setIsMenuOpen(false);
    // TODO: Implémenter les actions réelles
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
    <div className="w-full">
      <div
        ref={lessonRef}
        onClick={handleBeginReadLesson}
        onKeyDown={handleBeginReadLesson}
        className={`flex items-center justify-between gap-1 rounded-xl px-4 h-10 w-full cursor-pointer group ${
          isLessonSelected
            ? "bg-accent text-accent-content hover:bg-accent/80"
            : "bg-primary text-base-100 hover:bg-primary/80"
        }`}
      >
        <span className="flex gap-1 justify-between items-center min-w-0 w-full">
          <p className="max-h-14 truncate text-sm" data-tip={lesson.title}>
            {lesson.title}
          </p>
          <div className="flex items-center gap-1">
            <Can action="update" object="lesson">
              <div className="relative">
                <button
                  type="button"
                  className="btn btn-sm px-2 btn-ghost w-fit hover:bg-transparent hover:text-base-100"
                  onClick={handleMenuClick}
                >
                  <EllipsisIcon className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg min-w-[10rem] py-1 z-20">
                      <button
                        type="button"
                        onClick={() => handleMenuOption("duplicate")}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Dupliquer</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMenuOption("move")}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left text-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Déplacer</span>
                      </button>
                      <Can action="update" object="lesson">
                        <Link
                          to={`/admin/lesson/edit-lesson/${lesson.id}`}
                          state={{ moduleId: moduleId }}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full text-left text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>Éditer les détails</span>
                        </Link>
                      </Can>
                      <button
                        type="button"
                        onClick={() => handleMenuOption("delete")}
                        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-100 text-red-600 w-full text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </Can>
          </div>
        </span>

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
      {isLessonSelected && children}
    </div>
  );
};

export default LessonItem;
