import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useEffect, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";

// Hook personnalisé pour la gestion de l'aperçu des leçons destinés à l'apprenant
const useLessonsPreview = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { state: stateFromUrl } = useLocation();
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  // Récupération de toutes les leçons à partir des cours du module
  const lessons = moduleData?.courses.flatMap((course) => course.lessons) || [];

  // Fonction pour passer à la leçon suivante
  const switchToNextLesson = () => {
    if (selectedLesson && lessons.length > 0) {
      const currentIndex = lessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id,
      );
      if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
        const nextLesson = lessons[currentIndex + 1];
        setSelectedLesson({
          ...nextLesson,
          lessonsRead: nextLesson.lessonsRead,
        });
      } else {
        setSelectedLesson(undefined);
      }
    }
  };

  // Handler pour marquer une leçon comme terminée
  const handleFinishReadLesson = () => {
    // Fonction de mise à jour des données du module
    const applyData = (data: { data: LessonRead }) => {
      setModuleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          courses: prev.courses.map((course) => ({
            ...course,
            lessons: course.lessons.map((lesson) => {
              if (
                lesson.id === selectedLesson?.id &&
                lesson.lessonsRead?.length === 0
              ) {
                return { ...lesson, lessonsRead: [data.data] };
              }
              return lesson;
            }),
          })),
        };
      });
      switchToNextLesson();
    };

    sendRequest(
      { path: `/lesson/read/${selectedLesson?.id}`, method: "put" },
      applyData,
    );
  };

  // useEffect pour charger les détails d'une leçon sélectionnée
  useEffect(() => {
    const applyData = (data: Lesson) => {
      // Marquer le début de lecture d'une leçon
      if (data.lessonsRead) {
        setSelectedLesson({ ...data });
      }
      if (data?.lessonsRead && data?.lessonsRead?.length === 0) {
        sendRequest({
          path: `/lesson/read/${data.id}`,
          method: "post",
        });
      }
    };

    if (!selectedLesson?.id) return;
    sendRequest({ path: `/lesson/${selectedLesson.id}` }, applyData);
  }, [selectedLesson?.id, sendRequest]);

  // useEffect pour charger les données initiales du module
  useEffect(() => {
    const applyData = ({ data }: { data: Module }) => {
      setModuleData(data);
      if (stateFromUrl?.lessonId) {
        const lessonToSelect = data.courses
          .flatMap((course) => course.lessons)
          .find((lesson) => lesson.id === stateFromUrl.lessonId);
        if (lessonToSelect) {
          setSelectedLesson({
            ...lessonToSelect,
            lessonsRead: lessonToSelect.lessonsRead,
          });
        }
      }
    };

    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      applyData,
    );
  }, [moduleId, sendRequest, stateFromUrl?.lessonId]);

  // Retourne les données et fonctions nécessaires
  return {
    moduleData,
    selectedLesson,
    isLoading,
    setModuleData,
    setSelectedLesson,
    onFinishReadLesson: handleFinishReadLesson,
  };
};

export default useLessonsPreview;
