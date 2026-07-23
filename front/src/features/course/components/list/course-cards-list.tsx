import EntityCardsList from "../../../../components/UI/entity-cards-list";
import CourseCard from "./course-card";
import CustomCourse from "./interfaces/custom-course";

interface CourseCardsListProps {
  courseList: CustomCourse[];
  onDeleteCourse: (course: CustomCourse) => void;
}

export default function CourseCardsList({
  courseList,
  onDeleteCourse,
}: CourseCardsListProps) {
  return (
    <EntityCardsList
      items={courseList}
      emptyMessage="Aucun cours trouvé."
      renderItem={(course) => (
        <CourseCard course={course} onDeleteCourse={onDeleteCourse} />
      )}
    />
  );
}
