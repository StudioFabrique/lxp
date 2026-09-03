import { CourseQualityRating } from "../../interfaces/lessons-quality-stats";
import BestCourseItem from "./best-course-item";

type BesCoursesListProps = {
  coursesRating?: CourseQualityRating[];
};

const BestLessonsList = ({ coursesRating }: BesCoursesListProps) => {
  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {coursesRating && coursesRating?.length > 0 ? (
        coursesRating.map((item) => (
          <BestCourseItem
            key={item.firstLessonId}
            firstLessonId={item.firstLessonId}
            moduleId={item.moduleId}
            title={item.courseTitle}
            rating={item.rating}
          />
        ))
      ) : (
        <span className="text-base-content">
          Aucun cours n'a encore été noté
        </span>
      )}
    </div>
  );
};

export default BestLessonsList;
