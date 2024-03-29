import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import useInput from "../../../hooks/use-input";
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import Lesson from "../../../utils/interfaces/lesson";
import LessonForm from "./lesson-form";
import Tag from "../../../utils/interfaces/tag";
import useHttp from "../../../hooks/use-http";
import LessonsList from "./lessons-list";
import { courseScenarioActions } from "../../../store/redux-toolkit/course/course-scenario";
import SubmitButton from "../../UI/submit-button";
import AddIcon from "../../UI/svg/add-icon";
import EditIcon from "../../UI/svg/edit-icon";
import Modal from "../../UI/modal/modal";
import useLessonHTTP from "../../../hooks/use-lesson-http";

interface LinearScenarioLessonsProps {
  lessons: Lesson[];
  loading: boolean;
  success: boolean;
}

const LinearScenarioLessons = (props: LinearScenarioLessonsProps) => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { sendRequest, error } = useHttp();
  const { deleteLesson } = useLessonHTTP();
  const { value: title, newProps: newTitle } = useInput((value) =>
    regexGeneric.test(value)
  );
  const { value: description, newProps: newDescription } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const tagsList = useSelector(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (state: any) => state.courseInfos.course.tags
  ) as Tag[];
  const [isLoading, setIsLoading] = useState(false);
  const [editionMode, setEditionMode] = useState(false);
  const formRef = useRef<HTMLInputElement>(null);
  const [editedLesson, setEditedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);

  /**
   * envoie une requête HTTP pour enregistrer une nouvelle
   * leçon associée au cours
   */
  const handleSubmitLesson = () => {
    const applyData = (data: Lesson) => {
      dispatch(courseScenarioActions.newLesson(data));
      handleResetForm();
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

  /**
   * Met à jour la leçon dans la bdd
   */
  const handleUpdateLesson = () => {
    const applyData = (data: Lesson) => {
      dispatch(courseScenarioActions.updateLesson(data));
      handleResetForm();
    };
    sendRequest(
      {
        path: `/lesson/update`,
        method: "put",
        body: {
          id: editedLesson!.id,
          title: title.value,
          description: description.value,
          tagId: tag!.id,
          modalite: mode,
        },
      },
      applyData
    );
  };

  /**
   * Permet de modifier les informations de base d'une leçon
   * @param lesson Lesson
   */
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

  /**
   * Permet de dissocier une leçon d'un cours
   * @param lesson Lesson
   */
  const handleDeleteLesson = async () => {
    const data = await deleteLesson(lessonToDelete!);
    if (data.success) {
      dispatch(courseScenarioActions.deleteLesson(lessonToDelete));
      toast.success(data.message);
      setLessonToDelete(null);
    }
  };

  /**
   * réinitialise le formulaire
   */
  const handleResetForm = () => {
    title.reset();
    description.reset();
    newTitle("");
    newDescription("");
    setTag(null);
    setMode("hybride");
    setEditionMode(false);
  };

  // quand le formulaire passe en mode édition la vue scroll jusqu'au premier champ du formulaire et lui donne le focus
  useEffect(() => {
    if (formRef && formRef.current && editionMode) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      formRef.current.focus();
    }
  }, [editionMode]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      setIsLoading(false);
    }
  }, [error]);

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
                label="Mettre à jour la leçon"
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
                label="Ajouter la leçon"
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
          title="Supprimer une leçon"
          isSubmitting={isLoading}
          message="Attention la leçon et les ressources qui lui sont associées seront définitivement supprimées."
          leftLabel="Annuler"
          rightLabel="Confirmer"
        />
      ) : null}
    </>
  );
};

export default LinearScenarioLessons;
