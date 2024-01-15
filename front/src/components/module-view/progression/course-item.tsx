import { ArrowDown, ArrowRight } from "lucide-react";
import Course from "../../../utils/interfaces/course";
import { useState } from "react";
import { motion } from "framer-motion";

type CourseItemProps = { course: Course };

const CourseItem = ({ course }: CourseItemProps) => {
  const [isCourseOpen, setCourseOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-col w-full cursor-pointer"
        onClick={() => setCourseOpen(!isCourseOpen)}
      >
        <div className="bg-secondary p-4 rounded-xl flex flex-col gap-2">
          {/* Titre du cours + tooltip */}
          <td className="capitalize">
            <div className="relative">
              <span
                data-tip={`Titre : ${course.title}`}
                className="w-full h-10 tooltip tooltip-right absolute"
              />
            </div>
            <div className="truncate">
              <h3 className="text-secondary-content/70">{course.title}</h3>
            </div>
          </td>
          <div className="flex justify-between gap-5">
            <p className="text-secondary-content font-semibold text-sm w-[80%] max-h-10 break-words overflow-y-clip">
              {course.description}
            </p>
            {isCourseOpen ? (
              <ArrowDown className="stroke-primary" />
            ) : (
              <ArrowRight className="stroke-primary" />
            )}
          </div>
        </div>
        <progress
          className="w-full progress progress-primary -mt-[8px] rounded-b-full"
          value={0.5}
        />
      </div>
      <motion.div
        className="bg-secondary/80 -mt-2 rounded-b-xl p-2 flex flex-col items-center"
        animate={{
          display: isCourseOpen ? "block" : "none",
          height: isCourseOpen ? 200 : 0,
        }}
      >
        <p>Aucune leçons</p>
      </motion.div>
    </div>
  );
};

export default CourseItem;
