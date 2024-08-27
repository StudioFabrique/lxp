import CardListItem from "../UI/card-list-item";
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
    <>
      {courseList && courseList.length > 0 ? (
        <CardListItem>
          {courseList.map((item) => (
            <li key={item.id}>
              <CourseCard course={item} onDeleteCourse={onDeleteCourse} />
            </li>
          ))}
        </CardListItem>
      ) : (
        <p>Aucun cours n'a été trouvé.</p>
      )}
    </>
  );
}
