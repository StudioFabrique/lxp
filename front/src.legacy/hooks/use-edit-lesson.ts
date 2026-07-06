import { useCallback, useEffect, useState } from "react";
import { regexGeneric, regexOptionalGeneric } from "../utils/constantes";
import Lesson from "../utils/interfaces/lesson";
import useInput from "./use-input";
import Tag from "../utils/interfaces/tag";
import useHttp from "./use-http";
import toast from "react-hot-toast";
import { useNavigate, useParams, useLocation } from "react-router";

/**
 * Hook personnalisé pour gérer l'édition d'une leçon
 * Gère le chargement, la mise à jour et la validation des données d'une leçon
 */
const useEditLesson = () => {
  // Récupération de l'ID de la leçon depuis les paramètres d'URL
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { sendRequest, error, isLoading } = useHttp();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialisation des champs de formulaire avec validation
  const { value: title, newProps: newTitle } = useInput((value) =>
    regexGeneric.test(value),
  );
  const { value: description, newProps: newDescription } = useInput((value) =>
    regexOptionalGeneric.test(value),
  );
  const [mode, setMode] = useState<string>("hybride");
  const [tag, setTag] = useState<Tag | null>(null);
  const [tagsList, setTagsList] = useState<Tag[]>([]);

  /**
   * Remplit les champs du formulaire avec les données de la leçon
   * @param lesson Objet contenant les données de la leçon
   */
  const setLessonValues = useCallback(
    (lesson: Lesson) => {
      newTitle(lesson.title);
      newDescription(lesson.description);
      setTag(lesson.tag);
      setMode(lesson.modalite);
      setTagsList(lesson.course.tags);
    },
    [newTitle, newDescription],
  );

  /**
   * Gère la mise à jour de la leçon
   * Envoie les données au serveur et redirige vers la liste des leçons
   */
  const handleUpdateLesson = () => {
    const applyData = (/*data: Lesson*/) => {
      if (location.state?.moduleId) {
        navigate(`/admin/parcours/module/${location.state.moduleId}`, {
          state: { lessonId: Number(lessonId) },
        });
      } else {
        navigate(`/admin/lesson`);
      }
      toast.success("Leçon mise à jour");
    };

    sendRequest(
      {
        path: `/lesson/update`,
        method: "put",
        body: {
          id: lesson!.id,
          title: title.value,
          description: description.value,
          tagId: tag!.id,
          modalite: mode,
        },
      },
      applyData,
    );
  };

  /**
   * Récupère les données de la leçon depuis le serveur
   */
  const getLesson = useCallback(() => {
    const applyData = (data: { success: boolean; lesson: Lesson }) => {
      setLesson(data.lesson);
      setLessonValues(data.lesson);
    };
    sendRequest({ path: `/lesson/edit/${lessonId}` }, applyData);
  }, [lessonId, sendRequest, setLessonValues]);

  // Charge les données de la leçon au montage du composant
  useEffect(() => {
    getLesson();
  }, [getLesson]);

  // Affiche les erreurs éventuelles
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  // Expose les données et fonctions nécessaires
  return {
    lesson,
    isLoading,
    title,
    description,
    mode,
    setMode,
    tag,
    setTag,
    tagsList,
    setLessonValues,
    handleUpdateLesson,
  };
};

export default useEditLesson;
