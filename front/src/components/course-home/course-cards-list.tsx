import CardListItem from "../UI/card-list-item";
import ElementNotFound from "../UI/element-not-found";
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
        <ElementNotFound message="Aucun cours trouvé." />
      )}
    </>
  );
}
