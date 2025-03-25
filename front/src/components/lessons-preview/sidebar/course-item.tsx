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
        <div className="flex flex-col gap-1 bg-secondary/80 p-4 rounded-xl">
          {/* Titre du cours + tooltip */}

          <div className="flex justify-between items-center gap-1">
            <span
              data-tip={`Titre : ${course.title}`}
              className="flex items-center tooltip tooltip-right capitalize min-w-0"
            >
              <h3 className="text-secondary-content/80 capitalize truncate">
                {course.title}
              </h3>
            </span>
            <Can action="write" object="course">
              <div
                onClick={handleClickMenu}
                className="dropdown dropdown-right"
              >
                <button className="flex cursor-pointer">
                  <MoreVertical className="stroke-secondary-content w-7 h-7 hover:bg-primary/20 px-1 rounded-lg transition-colors" />
                </button>

                <div className="dropdown-content menu translate-x-5 -translate-y-3 bg-base-300/80 text-base-content rounded-lg z-50 w-60 backdrop-blur-sm border border-primary/20">
                  <Can action="update" object="course">
                    <Link
                      to={`/admin/course/edit/${course.id}`}
                      className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all first:rounded-t-lg"
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Modifier le cours
                    </Link>
                  </Can>

                  <Link
                    to="/admin/lesson/add"
                    className="cursor-default flex items-center px-4 py-3 text-sm hover:bg-primary/20 transition-all"
                  >
                    <ListPlus className="w-4 h-4 mr-3" />
                    Ajouter une leçon
                  </Link>

                  <Can action="delete" object="course">
                    <button className="cursor-default flex items-center w-full px-4 py-3 text-sm text-error hover:bg-error/10 transition-all last:rounded-b-lg">
                      <Trash className="w-4 h-4 mr-3" />
                      Supprimer le cours
                    </button>
                  </Can>
                </div>
              </div>
            </Can>
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
