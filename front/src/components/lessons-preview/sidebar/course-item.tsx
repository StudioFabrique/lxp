import { ArrowDown, ArrowRight, Edit, ListPlus } from "lucide-react";
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
        <div className="bg-secondary/80 p-4 rounded-xl flex flex-col gap-4">
          {/* Titre du cours + tooltip */}

          <div className="flex justify-between items-center gap-1 min-w-0">
            <span
              data-tip={`Titre : ${course.title}`}
              className="flex items-center w-[75%] h-12 tooltip tooltip-right capitalize min-w-0"
            >
              <h3 className="text-secondary-content/80 capitalize truncate min-w-0">
                {course.title}
              </h3>
            </span>

            <div className="flex gap-2 flex-shrink-0">
              <Can action="update" object="lesson">
                <div
                  className="tooltip"
                  data-tip="Modifier les informations du cours"
                >
                  <Link to={`/admin/course/edit/${course.id}`}>
                    <Edit className="stroke-base-100 w-7 h-7 hover:bg-primary px-1 rounded-lg" />
                  </Link>
                </div>
              </Can>
              <Can action="write" object="lesson">
                <div className="tooltip" data-tip="Ajouter une leçon">
                  <Link
                    to="/admin/lesson/add"
                    // state={{ parcoursId, moduleId, courseId }}
                  >
                    <ListPlus className="stroke-base-100 w-7 h-7 hover:bg-primary px-1 rounded-lg" />
                  </Link>
                </div>
              </Can>
            </div>
          </div>

          <div className="flex justify-between items-center gap-5 pr-2 min-w-0">
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
