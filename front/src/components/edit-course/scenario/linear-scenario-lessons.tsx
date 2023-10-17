import { useEffect, useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import Lesson from "../../../utils/interfaces/lesson";
import LessonForm from "./lesson-form";
import Tag from "../../../utils/interfaces/tag";
import { useSelector } from "react-redux";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LessonsList from "./lessons-list";
import { useDispatch } from "react-redux";
import { courseScenarioActions } from "../../../store/redux-toolkit/course/course-scenario";
import SubmitButton from "../../UI/submit-button";
import AddIcon from "../../UI/svg/add-icon";
import EditIcon from "../../UI/svg/edit-icon";

interface LinearScenarioLessonsProps {
  lessons: Lesson[];
}

const LinearScenarioLessons = (props: LinearScenarioLessonsProps) => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const { value: title, newProps: newTitle } = useInput((value) =>
    regexGeneric.test(value)
  );
  const { value: description, newProps: newDescription } = useInput((value) =>
    regexGeneric.test(value)
  );
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const tagsList = useSelector(
    (state: any) => state.courseInfos.course.tags
  ) as Tag[];
  const [isLoading, setIsLoading] = useState(false);
  const [editionMode, setEditionMode] = useState(false);

  /**
   * envoie une requête HTTP pour enregistrer une nouvelle
   * leçon associée au cours
   */
  const handleSubmitLesson = () => {
    const applyData = (data: Lesson) => {
      dispatch(courseScenarioActions.newLesson(data));
      setIsLoading(false);
    };
    setIsLoading(true);
    sendRequest(
      {
        path: `/course/new-lesson/${courseId}`,
        method: "put",
        body: {
          tagId: tag?.id,
          title: title.value,
          description: description.value,
          modalite: mode,
        },
      },
      applyData
    );
  };

  const handleEditLesson = (lesson: Lesson) => {
    newTitle(lesson.title);
    newDescription(lesson.description);
    setTag(lesson.tag);
    setMode(lesson.modalite);
    setEditionMode(true);
  };

  const handleDeleteLesson = (lesson: Lesson) => {};

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setIsLoading(false);
    }
  }, [error]);

  const handleResetForm = () => {
    newTitle("");
    newDescription("");
    setTag(null);
    setMode("hybride");
    setEditionMode(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <LessonForm
        title={title}
        description={description}
        mode={mode}
        tag={tag}
        isLoading={isLoading}
        onSetTag={setTag}
        tags={tagsList}
        onSetMode={setMode}
        onSubmitLesson={handleSubmitLesson}
      >
        <div className="w-full flex justify-between">
          {editionMode ? (
            <button
              className="btn btn-primary btn-outline"
              type="button"
              onClick={handleResetForm}
            >
              Annuler
            </button>
          ) : null}
          <SubmitButton
            label={editionMode ? "Mettre à jour" : "Ajouter la leçon"}
            loadingLabel={
              editionMode ? "Mise à jour en cours" : "Ajout en cours"
            }
            isLoading={isLoading}
          >
            <div className="w-- h-6">
              {editionMode ? <EditIcon /> : <AddIcon />}
            </div>
          </SubmitButton>
        </div>
      </LessonForm>
      <LessonsList
        lessonsList={props.lessons}
        onEdit={handleEditLesson}
        onDelete={handleDeleteLesson}
      />
    </div>
  );
};

export default LinearScenarioLessons;
