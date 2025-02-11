import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useMemo, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../../../utils/interfaces/lesson-rating";

// Hook personnalisé pour la gestion de l'aperçu des leçons destinés à l'apprenant
const useLessonsPreview = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { state: stateFromUrl } = useLocation();
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState<Module | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>();
  const [lessonRating, setLessonRating] = useState<LessonRating>();

  // Vérifie si la leçon a déjà été complétée
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Récupération de toutes les leçons à partir des cours du module
  const lessons = useMemo(
    () => moduleData?.courses.flatMap((course) => course.lessons) || [],
    [moduleData?.courses],
  );

  const initiateLesson = useCallback(
    (lessonId: number) => {
      sendRequest({
        path: `/lesson/read/${lessonId}`,
        method: "post",
      });
    },
    [sendRequest],
  );

  const handleLessonSelection = useCallback(
    (lesson: Lesson | undefined) => {
      setSelectedLesson(lesson);
      if (lesson?.id) {
        initiateLesson(lesson.id);
      }
    },
    [initiateLesson],
  );

  // Fonction pour passer à la leçon suivante
  const switchToNextLesson = () => {
    if (selectedLesson && lessons.length > 0) {
      const currentIndex = lessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id,
      );
      if (currentIndex !== -1 && currentIndex + 1 < lessons.length) {
        const nextLesson = lessons[currentIndex + 1];
        handleLessonSelection(nextLesson); // Utiliser la nouvelle fonction
      } else {
        handleLessonSelection(undefined);
      }
    }
  };

  // Handler pour marquer une leçon comme terminée
  const handleCompleteLesson = (skipToNextLesson?: boolean) => {
    // Afficher directement la prochaine leçon si showNextLesson est true
    if (isLessonCompleted) {
      setLessonRating(undefined);
      switchToNextLesson();
      return;
    }

    setIsLessonCompleted(true);

    // Fonction de mise à jour des données du module
    const applyData = (data: { data: LessonRead }) => {
      setModuleData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          courses: prev.courses.map((course) => ({
            ...course,
            lessons: course.lessons.map((lesson) => {
              if (lesson.id === selectedLesson?.id) {
                return {
                  ...lesson,
                  lessonsRead: [...(lesson.lessonsRead || []), data.data],
                };
              }
              return lesson;
            }),
          })),
        };
      });
    };

    sendRequest(
      { path: `/lesson/read/${selectedLesson?.id}`, method: "put" },
      applyData,
    );

    if (skipToNextLesson) {
      switchToNextLesson();
      setLessonRating(undefined);
    }
  };

  // Récupération initiale d'une note déjà attribuée à une leçon
  const handleInitGetLessonRating = useCallback(() => {
    const applyData = (data: { data: LessonRating }) => {
      setLessonRating(data.data);
    };

    // If selectedLesson, already read with at least a activity
    if (
      selectedLesson &&
      selectedLesson.activities &&
      selectedLesson.activities?.length > 1 &&
      selectedLesson.lessonsRead &&
      selectedLesson.lessonsRead[0]?.finishedAt
    ) {
      sendRequest(
        { path: `/lesson/rate/${selectedLesson.id}`, method: "get" },
        applyData,
      );
    }
  }, [selectedLesson, sendRequest]);

  // Évaluer le cours en tant que apprenant
  const handleRateContent = (rating: number) => {
    const applyData = (data: { data: LessonRating }) => {
      setLessonRating(data.data);
    };

    if (selectedLesson?.id)
      sendRequest(
        {
          method: "post",
          path: `/lesson/rate/${selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData,
      );
  };

  // Évaluer le cours en tant que apprenant
  const handleEditRateContent = (rating: number) => {
    console.log({ rating });

    const applyData = (data: { data: LessonRating }) => {
      console.log({ data });
      setLessonRating(data.data);
    };

    if (selectedLesson?.id)
      sendRequest(
        {
          method: "put",
          path: `/lesson/rate/${selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData,
      );
  };

  // useEffect pour charger les détails d'une leçon sélectionnée
  useEffect(() => {
    const applyData = (data: Lesson) => {
      // Marquer le début de lecture d'une leçon
      const lessonInModule = lessons.find((lesson) => lesson.id === data.id);
      setSelectedLesson({
        ...data,
        lessonsRead: lessonInModule?.lessonsRead || [],
      });
    };

    if (!selectedLesson?.id) return;
    sendRequest({ path: `/lesson/${selectedLesson.id}` }, applyData);
  }, [selectedLesson?.id, lessons, sendRequest]);

  // useEffect pour charger les données initiales du module
  useEffect(() => {
    const applyData = ({ data }: { data: Module }) => {
      setModuleData(data);
      if (stateFromUrl?.lessonId) {
        // selectionner la leçon selectionnée depuis le state de l'url
        const lessonToSelect = data.courses
          .flatMap((course) => course.lessons)
          .find((lesson) => lesson.id === stateFromUrl?.lessonId);
        if (lessonToSelect) {
          handleLessonSelection(lessonToSelect);
        }
      }
    };

    sendRequest(
      { path: `/modules/detail/${moduleId}`, method: "get" },
      applyData,
    );
  }, [moduleId, sendRequest, stateFromUrl?.lessonId, handleLessonSelection]);

  useEffect(() => {
    setIsLessonCompleted(
      Boolean(
        selectedLesson?.lessonsRead?.some(
          (lessonRead) => lessonRead.finishedAt,
        ),
      ),
    );
  }, [selectedLesson?.lessonsRead]);

  useEffect(() => {
    handleInitGetLessonRating();
  }, [handleInitGetLessonRating]);

  // Retourne les données et fonctions nécessaires
  return {
    moduleData,
    selectedLesson,
    lessonRating,
    isLoading,
    setModuleData,
    isLessonCompleted,
    setSelectedLesson: handleLessonSelection,
    onCompleteLesson: handleCompleteLesson,
    onRateContent: handleRateContent,
    onEditRateContent: handleEditRateContent,
  };
};

export default useLessonsPreview;
