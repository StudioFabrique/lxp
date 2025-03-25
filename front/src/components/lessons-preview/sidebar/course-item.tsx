import {
  ArrowDown,
  ArrowRight,
  Edit,
  ListPlus,
  MoreVertical,
  Trash,
} from "lucide-react";
import Course from "../../../utils/interfaces/course";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LessonItem from "./lesson-item";
import Lesson from "../../../utils/interfaces/lesson";
import Can from "../../UI/can/can.component";
import { Link } from "react-router-dom";

type CourseItemProps = {
  course: Course;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: (lesson: Lesson | undefined) => void;
};

const CourseItem = ({
  course,
  selectedLesson,
  setSelectedLesson,
}: CourseItemProps) => {
  const [isCourseOpen, setCourseOpen] = useState(false);
  const courseProgress = (
    course.lessons.reduce(
      (sum, lesson) =>
        sum +
        (lesson?.lessonsRead?.filter((lesson) => lesson.finishedAt).length ||
          0),
      0,
    ) / course.lessons.length
  ).toString();

  const handleToggleCourseTab = () => {
    setCourseOpen(!isCourseOpen);
  };

  const handleClickMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Ouvre la barre litteral lorsqu'une leçon a été selectionné par un autre moyen (clic sur le bouton "Leçon Suivante")
  useEffect(() => {
    if (
      selectedLesson &&
      course.lessons.some((lesson) => lesson.id === selectedLesson.id)
    ) {
      setCourseOpen(true);
    } else {
      setCourseOpen(false);
    }
  }, [course.lessons, selectedLesson]);

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex flex-col w-full cursor-pointer"
        onClick={handleToggleCourseTab}
      >
        <div className="bg-secondary/80 p-4 rounded-xl">
          {/* Titre du cours + tooltip */}

          <div className="flex justify-between items-center gap-1">
            <span
              data-tip={`Titre : ${course.title}`}
              className="flex items-center h-12 tooltip tooltip-right capitalize min-w-0"
            >
              <h3 className="text-secondary-content/80 capitalize truncate">
                {course.title}
              </h3>
            </span>

            <div onClick={handleClickMenu} className="dropdown dropdown-right">
              <div className="tooltip" data-tip="Options">
                <button>
                  <MoreVertical className="stroke-secondary-content w-7 h-7 hover:bg-primary/20 px-1 rounded-lg transition-colors" />
                </button>
              </div>

              <div className="dropdown-content menu bg-secondary/95 rounded-md shadow-xl z-50 w-56 border border-primary/20">
                <Can action="update" object="lesson">
                  <Link
                    to={`/admin/course/edit/${course.id}`}
                    className="block px-4 py-2 text-sm text-secondary-content hover:bg-primary/10 transition-colors"
                  >
                    <Edit className="inline-block w-4 h-4 mr-2" />
                    Modifier le cours
                  </Link>
                </Can>
                <Can action="write" object="lesson">
                  <Link
                    to="/admin/lesson/add"
                    className="block px-4 py-2 text-sm text-secondary-content hover:bg-primary/10 transition-colors"
                  >
                    <ListPlus className="inline-block w-4 h-4 mr-2" />
                    Ajouter une leçon
                  </Link>
                </Can>
                <Can action="delete" object="lesson">
                  <button className="block w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors">
                    <Trash className="inline-block w-4 h-4 mr-2" />
                    Supprimer le cours
                  </button>
                </Can>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center gap-5 p-1 min-w-0">
            <span
              data-tip={`Description : ${course.description}`}
              className="tooltip tooltip-right flex-1 min-w-0"
            >
              <p className="text-secondary-content font-semibold text-sm w-[80%] max-h-10 break-words overflow-y-clip min-w-0">
                {course.description}
              </p>
            </span>
            <div className="flex-shrink-0 ">
              {isCourseOpen ? (
                <ArrowDown className="stroke-primary-content" />
              ) : (
                <ArrowRight className="stroke-primary-content" />
              )}
            </div>
          </div>
        </div>
        <Can action="component" object="progression">
          <progress
            className="w-full progress progress-primary bg-secondary -mt-[8px] rounded-b-full"
            value={courseProgress}
          />
        </Can>
      </div>
      <motion.div
        className="bg-secondary/20 -mt-2 rounded-b-xl overflow-y-auto"
        initial={{ maxHeight: 0 }}
        style={{
          height: isCourseOpen ? "auto" : 0,
          visibility: isCourseOpen ? "visible" : "hidden",
        }}
        animate={{
          maxHeight: isCourseOpen ? 280 : 0,
        }}
      >
        <div className="p-4 pt-6 flex flex-col gap-4 items-center">
          {course.lessons.length > 0 ? (
            course.lessons.map((lesson) => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                selectedLesson={selectedLesson}
                setSelectedLesson={setSelectedLesson}
              />
            ))
          ) : (
            <p>Aucune leçon</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseItem;
