import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { useCourseSelector, useCourseDispatch } from "../../../store/CourseContext";

import useInput from "../../../../../hooks/useInput";
import { regexGeneric, regexOptionalGeneric } from "../../../../../config/constantes";
import Lesson from "../../../../../../src/utils/interfaces/lesson";
import LessonForm from "./lesson-form";
import Tag from "../../../../../../src/utils/interfaces/tag";
import LessonsList from "./lessons-list";
import SubmitButton from "../../../../../components/UI/submit-button";
import AddIcon from "../../../../../../src/components/UI/svg/add-icon";
import EditIcon from "../../../../../../src/components/UI/svg/edit-icon";
import { courseApi } from "../../../api/course.api";
import Modal from "../../../../../components/UI/modal/modal";
import { getApiErrorMessage } from "../../../../../utils/helpers/api-error-message";

interface LinearScenarioLessonsProps {
  lessons: Lesson[];
  loading: boolean;
  success: boolean;
}

const LinearScenarioLessons = (props: LinearScenarioLessonsProps) => {
  const { courseId } = useParams();
  const dispatch = useCourseDispatch();
  const { value: title, newProps: newTitle } = useInput((value) =>
    regexGeneric.test(value)
  );
  const { value: description, newProps: newDescription } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const tagsList = useCourseSelector(
    (state) => state.course?.tags
  ) as Tag[];
  const [isLoading, setIsLoading] = useState(false);
  const [editionMode, setEditionMode] = useState(false);
  const formRef = useRef<HTMLInputElement>(null);
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);

  const handleSubmitLesson = async () => {
    setIsLoading(true);
    try {
      const data = await courseApi.mutations.addLesson(courseId!, {
        tagId: tag?.id,
        title: title.value,
        description: description.value,
        modalite: mode,
      });
      dispatch({ type: "NEW_LESSON", payload: data });
      handleResetForm();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Erreur inconnue"));
    }
    setIsLoading(false);
  };

  const handleUpdateLesson = async () => {
    try {
      const data = await courseApi.mutations.updateLesson({
        id: editedLesson!.id!,
        title: title.value,
        description: description.value,
        tagId: tag!.id,
        modalite: mode,
      });
      dispatch({ type: "UPDATE_LESSON", payload: data });
      handleResetForm();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Erreur inconnue"));
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditedLesson(lesson);
    setEditionMode(true);
    newTitle(lesson.title);
    newDescription(lesson.description);
    setTag(lesson.tag);
    setMode(lesson.modalite);
  };

  const setDeletion = (lesson: Lesson) => {
    setLessonToDelete(lesson.id!);
  };

  const handleDeleteLesson = async () => {
    try {
      const data = await courseApi.mutations.deleteLesson(lessonToDelete!);
      if (data.success) {
        dispatch({ type: "DELETE_LESSON", payload: lessonToDelete ?? undefined });
        toast.success(data.message);
        setLessonToDelete(null);
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Erreur inconnue"));
    }
  };

  const handleResetForm = () => {
    title.reset();
    description.reset();
    newTitle("");
    newDescription("");
    setTag(null);
    setMode("hybride");
    setEditionMode(false);
  };

  useEffect(() => {
    if (formRef && formRef.current && editionMode) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      formRef.current.focus();
    }
  }, [editionMode]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {editionMode ? (
          <LessonForm
            ref={formRef}
            title={title}
            description={description}
            mode={mode}
            tag={tag}
            isLoading={isLoading}
            onSetTag={setTag}
            tags={tagsList}
            onSetMode={setMode}
            onSubmitLesson={handleUpdateLesson}
          >
            <div className="w-full flex justify-between items-center">
              <button
                className="btn btn-primary btn-outline"
                type="button"
                onClick={handleResetForm}
              >
                Annuler
              </button>
              <SubmitButton
                label="Mettre à jour le contenu"
                loadingLabel="Mise à jour en cours"
                isLoading={isLoading}
              >
                <div className="w-- h-6">
                  <EditIcon />
                </div>
              </SubmitButton>
            </div>
          </LessonForm>
        ) : (
          <LessonForm
            ref={formRef}
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
            <div>
              <SubmitButton
                label="Créer un nouveau contenu"
                loadingLabel="Ajout en cours"
                isLoading={isLoading}
              >
                <div className="w-- h-6">
                  <AddIcon />
                </div>
              </SubmitButton>
            </div>
          </LessonForm>
        )}
        <LessonsList
          lessonsList={props.lessons}
          onEdit={handleEditLesson}
          onDelete={setDeletion}
          loading={props.loading}
          success={props.success}
        />
      </div>
      {lessonToDelete ? (
        <Modal
          onLeftClick={() => setLessonToDelete(null)}
          onRightClick={handleDeleteLesson}
          title="Supprimer un contenu"
          isSubmitting={isLoading}
          children="Attention le contenu et les ressources qui lui sont associées seront définitivement supprimées."
          leftLabel="Annuler"
          rightLabel="Confirmer"
        />
      ) : null}
    </>
  );
};

export default LinearScenarioLessons;
