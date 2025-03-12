import { CourseQualityRating } from "../../../utils/interfaces/lessons-quality-stats";
import BestCourseItem from "./best-course-item";

type BesCoursesListProps = {
  coursesRating?: CourseQualityRating[];
};

const BestLessonsList = ({ coursesRating }: BesCoursesListProps) => {
  return (
    <div className="flex flex-col gap-2 p-2 w-full">
      <h3 className="font-bold text-base-100">Meilleurs cours</h3>

      {coursesRating && coursesRating?.length > 0 ? (
        coursesRating.map((item) => (
          <BestCourseItem
            key={item.courseId}
            title={item.courseTitle}
            rating={item.rating}
          />
        ))
      ) : (
        <span className="text-base-300">Aucun cours n'a encore été noté</span>
      )}
    </div>
  );
};

export default BestLessonsList;
