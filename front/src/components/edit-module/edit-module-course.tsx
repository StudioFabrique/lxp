import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CheckCircle, GripVertical, Loader2, Pen, Trash2 } from "lucide-react";
import Course from "../../utils/interfaces/course";
import BookIcon from "../UI/svg/book-icon";
import Wrapper from "../UI/wrapper/wrapper.component";
import { Link } from "react-router-dom";
import Can from "../UI/can/can.component";

interface EditModuleCourseProps {
  courses: Course[];
  updating: boolean;
  success: boolean;
  onSetSubmit: (value: boolean) => void;
  onUpdateCourses: (updatedCourses: Course[]) => void;
}

const EditModuleCourse: React.FC<EditModuleCourseProps> = ({
  courses,
  updating,
  success,
  onSetSubmit,
  onUpdateCourses,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newCourses = Array.from(courses);
    const [movedCourse] = newCourses.splice(result.source.index, 1);
    newCourses.splice(result.destination.index, 0, movedCourse);

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="courses">
            {(provided) => (
              <ul
                className="flex flex-col gap-y-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {courses.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Wrapper>
                          <article className="flex justify-between items-center">
                            <div className="flex items-center gap-x-4">
                              <GripVertical className="w-10 h-10 text-primary/50" />
                              <div className="w-10 h-10 text-primary">
                                <BookIcon />
                              </div>
                              <span className="flex flex-col justify-center items-start">
                                <p className="text-base-content/50 text-xs">
                                  Cours {index + 1}
                                </p>
                                <p className="font-bold">{item.title}</p>
                              </span>
                            </div>
                            <span className="flex items-center gap-x-4">
                              <Can action="update" object="course">
                                <Link to={`/admin/course/edit/${item.id}`}>
                                  <Pen className="w-4 h-4 text-primary" />
                                </Link>
                              </Can>
                              <Can action="delete" object="course">
                                <Trash2 className="w-4 h-4 text-error" />
                              </Can>
                            </span>
                          </article>
                        </Wrapper>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <p className="text-xs">Aucun cours n'est associé à ce module.</p>
      )}
    </Wrapper>
  );
};

export default EditModuleCourse;
