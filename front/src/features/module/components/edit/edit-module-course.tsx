import React from "react";
import { CheckCircle, GripVertical, Loader2, Pen, Trash2 } from "lucide-react";
import Course from "../../../../utils/interfaces/course";
import BookIcon from "../../../../components/UI/svg/book-icon";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import { Link } from "react-router";
import PermissionGuard from "../../../../components/guards/PermissionGuard";
import { DndWrapper } from "../../../../components/UI/DndWrapper";

interface EditModuleCourseProps {
  courses: Course[];
  updating: boolean;
  success: boolean;
  onSetSubmit: (value: boolean) => void;
  onUpdateCourses: (updatedCourses: Course[]) => void;
  onRefreshModule?: () => void;
}

const EditModuleCourse: React.FC<EditModuleCourseProps> = ({
  courses,
  updating,
  success,
  onSetSubmit,
  onUpdateCourses,
}) => {
  const onDragEnd = (sourceIndex: number, destinationIndex: number) => {
    const newCourses = Array.from(courses);
    const [movedCourse] = newCourses.splice(sourceIndex, 1);
    newCourses.splice(destinationIndex, 0, movedCourse);

    // Mise à jour de l'état avec la nouvelle liste d'éléments
    // Vous devrez adapter cela à votre logique de gestion d'état
    onSetSubmit(true);
    onUpdateCourses(newCourses);
  };

  return (
    <Wrapper>
      <div className="flex items-center gap-x-2">
        <h2 className="text-lg font-bold text-primary">Contenu du module</h2>
        {updating ? (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        ) : null}
        {success ? <CheckCircle className="w-4 h-4 text-success" /> : null}
      </div>
      {courses && courses.length > 0 ? (
        <DndWrapper
          droppableId="courses"
          items={courses}
          isLoading={updating}
          onDragEnd={onDragEnd}
          getItemId={(course) => course.id}
          renderItem={(item, index) => (
            <Wrapper>
                          <article className="flex justify-between items-center">
                            <div className="flex items-center gap-x-4">
                              <GripVertical className="w-10 h-10 text-primary/50" />
                              <div className="w-10 h-10 text-primary">
                                <BookIcon />
                              </div>
                              <span className="flex flex-col justify-center items-start">
                                <p className="text-base-content/50 text-xs">
                                  Cours n° {index + 1}
                                </p>
                                <p className="font-bold">{item.title}</p>
                              </span>
                            </div>
                            <span className="flex items-center gap-x-4">
                              <PermissionGuard action="update" object="course">
                                <Link to={`/admin/course/edit/${item.id}`}>
                                  <Pen className="w-4 h-4 text-primary" />
                                </Link>
                              </PermissionGuard>
                              <PermissionGuard action="delete" object="course">
                                <Trash2 className="w-4 h-4 text-error" />
                              </PermissionGuard>
                            </span>
                          </article>
            </Wrapper>
          )}
        />
      ) : (
        <p className="text-xs">Aucun cours n'est associé à ce module.</p>
      )}
    </Wrapper>
  );
};

export default EditModuleCourse;
