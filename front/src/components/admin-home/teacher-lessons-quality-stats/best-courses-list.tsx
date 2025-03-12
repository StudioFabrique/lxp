import { CourseQualityRating } from "../../../utils/interfaces/lessons-quality-stats";
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
        <span className="text-base-300">Aucun cours n'a encore été noté</span>
      )}

      <button className="btn btn-sm btn-secondary text-base-100 self-end">
        Afficher plus
      </button>
    </div>
  );
};

export default BestLessonsList;
