import { ArrowDown, ArrowRight } from "lucide-react";
import Course from "../../../utils/interfaces/course";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LessonItem from "./lesson-item";
import Lesson from "../../../utils/interfaces/lesson";

type CourseItemProps = {
  course: Course;
  selectedLesson: Lesson | undefined;
  setSelectedLesson: Dispatch<SetStateAction<Lesson | undefined>>;
};

const CourseItem = ({
  course,
  selectedLesson,
  setSelectedLesson,
}: CourseItemProps) => {
  const [isCourseOpen, setCourseOpen] = useState(false);
  const courseProgress =
    course.lessons.reduce(
      (sum, lesson) => sum + (lesson?.lessonsRead?.length || 0),
      0
    ) / course.lessons.length;

  // Ouvre la barre litteral lorsqu'une leçon a été selectionné par un autre moyen (clic sur le bouton "Leçon Suivante")
  useEffect(() => {
    if (selectedLesson && course.lessons.includes(selectedLesson)) {
      setCourseOpen(true);
    } else {
      setCourseOpen(false);
    }
  }, [course.lessons, selectedLesson]);

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex flex-col w-full cursor-pointer"
        onClick={() => setCourseOpen(!isCourseOpen)}
      >
        <div className="bg-secondary/80 p-4 rounded-xl flex flex-col gap-2">
          {/* Titre du cours + tooltip */}
          <div className="capitalize">
            <div className="relative">
              <span
                data-tip={`Titre : ${course.title}`}
                className="w-full h-10 tooltip tooltip-right absolute"
              />
            </div>
            <div className="truncate">
              <h3 className="text-secondary-content/80">{course.title}</h3>
            </div>
          </div>
          <div className="flex justify-between gap-5">
            <p className="text-secondary-content font-semibold text-sm w-[80%] max-h-10 break-words overflow-y-clip">
              {course.description}
            </p>
            {isCourseOpen ? (
              <ArrowDown className="stroke-primary-content" />
            ) : (
              <ArrowRight className="stroke-primary-content" />
            )}
          </div>
        </div>
        <progress
          className="w-full progress progress-primary bg-secondary -mt-[8px] rounded-b-full"
          value={courseProgress}
        />
      </div>
      <motion.div
        className="bg-secondary/20 -mt-2 rounded-b-xl overflow-y-auto"
        animate={{
          display: isCourseOpen ? "block" : "none",
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
            <p>Aucune leçons</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CourseItem;
