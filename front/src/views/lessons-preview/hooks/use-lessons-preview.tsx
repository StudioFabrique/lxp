import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useMemo, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../../../utils/interfaces/lesson-rating";
import toast from "react-hot-toast";
import { Activity } from "../../../utils/interfaces/activity";

// Hook personnalisé pour la gestion de l'aperçu des leçons destinés à l'apprenant
const useLessonsPreview = () => {
  const { sendRequest, isLoading } = useHttp(true);
  const { state: stateFromUrl } = useLocation();
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [moduleData, setModuleData] = useState<
    (Module & { parcours: string; parcoursId: number }) | null
  >(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson>();
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [lessonRating, setLessonRating] = useState<LessonRating>();
  const STORAGE_KEY = "lessons-preview-panel-closed";
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isPanelClosed, setPanelClosed] = useState<boolean>(false);

  // Vérifie si la leçon a déjà été complétée
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Vérifie si le mode de création d'activité est actif
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);

  // Récupération de toutes les leçons à partir des cours du module
  const lessons = useMemo(
    () => moduleData?.courses.flatMap((course) => course.lessons) || [],
    [moduleData?.courses]
  );

  const selectedLessonHasActivities = selectedLesson
    ? Boolean(selectedLesson.activities?.length)
    : false;

  // Modal management
  const handleToggleModalDisplaying = () => {
    setTimeout(() => {
      setShowModal((prev) => !prev);
    }, 800);
  };

  const handleClickModalRightButton = () => {
    handleCompleteLesson(true);
    setShowModal((prev) => !prev);
  };

  const initiateLesson = useCallback(
    (lessonId: number) => {
      sendRequest({
        path: `/lesson/read/${lessonId}`,
        method: "post",
      });
    },
    [sendRequest]
  );

  const handleLessonSelection = useCallback(
    (lesson: Lesson | undefined) => {
      setIsCreatingActivity(false);
      setLessonRating(undefined);
      setSelectedLesson(lesson);

      // Update the URL state
      navigate(".", {
        replace: true, // This replaces the current history entry instead of adding a new one
        state: { lessonId: lesson?.id }, // Set to undefined when no lesson is selected
      });

      if (lesson?.id) {
        initiateLesson(lesson.id);
      }
    },
    [initiateLesson, navigate]
  );

  // Fonction pour passer à la leçon suivante
  const switchToNextLesson = () => {
    setLessonRating(undefined);

    if (selectedLesson && lessons.length > 0) {
      const currentIndex = lessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id
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
      applyData
    );

    if (skipToNextLesson) {
      switchToNextLesson();
    }
  };

  // Récupération initiale d'une note déjà attribuée à une leçon
  const handleInitGetLessonRating = useCallback(() => {
    const applyData = (data: { data: LessonRating }) => {
      setLessonRating(data.data);
    };

    // If selectedLesson, already read with at least a activity
    if (selectedLesson) {
      sendRequest(
        { path: `/lesson/rate/${selectedLesson.id}`, method: "get" },
        applyData
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
        applyData
      );
  };

  // Évaluer le cours en tant que apprenant
  const handleEditRateContent = (rating: number) => {
    const applyData = (data: { data: LessonRating }) => {
      setLessonRating(data.data);
    };

    if (selectedLesson?.id)
      sendRequest(
        {
          method: "put",
          path: `/lesson/rate/${selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData
      );
  };

  const handleEnableCourse = async (courseId: number, visibility: boolean) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        fetchData();
      }
    };

    await sendRequest(
      {
        path: `/course/enable-course/${courseId}?visibility=${visibility}`,
        method: "put",
      },
      applyData
    );
  };

  const handleDeleteCourse = async (courseId: number) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        handleLessonSelection(undefined);
        fetchData();
      }
    };

    await sendRequest(
      { path: `/course/delete-course/${courseId}`, method: "delete" },
      applyData
    );
  };

  const handleSelectActivityId = (activity: Activity) => {
    setIsCreatingActivity(false);
    setSelectedActivity(activity);
  };

  const handleCreateActivity = () => {
    setIsCreatingActivity(true);
  };

  const handleCloseTextEditor = () => {
    setIsCreatingActivity(false);
  };

  const handleActivityCreated = (activity: Activity) => {
    // Sélectionner automatiquement l'activité créée
    setSelectedActivity(activity);
  };

  const fetchData = useCallback(() => {
    const applyData = ({
      data,
    }: {
      data: Module & { parcours: string; parcoursId: number };
    }) => {
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

    sendRequest({ path: `/modules/detail/limited/${moduleId}` }, applyData);
  }, [moduleId, sendRequest, stateFromUrl?.lessonId, handleLessonSelection]);

  // Panel closed state management
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      setPanelClosed(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isPanelClosed));
  }, [isPanelClosed]);

  // useEffect pour charger les détails d'une leçon sélectionnée
  useEffect(() => {
    const applyData = (data: Lesson) => {
      // Marquer le début de lecture d'une leçon
      const lessonInModule = lessons.find((lesson) => lesson.id === data.id);
      setSelectedLesson({
        ...data,
        lessonsRead: lessonInModule?.lessonsRead || [],
        order: lessonInModule?.order,
      });
      setSelectedActivity(data?.activities?.[0]);
    };

    if (!selectedLesson?.id) return;
    sendRequest({ path: `/lesson/${selectedLesson.id}` }, applyData);
  }, [selectedLesson?.id, lessons, sendRequest]);

  // useEffect pour charger les données initiales du module
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setIsLessonCompleted(
      Boolean(
        selectedLesson?.lessonsRead?.some((lessonRead) => lessonRead.finishedAt)
      )
    );
  }, [selectedLesson?.lessonsRead]);

  useEffect(() => {
    handleInitGetLessonRating();
  }, [handleInitGetLessonRating]);

  // Retourne les données et fonctions nécessaires
  return {
    fetchData,
    moduleData,
    selectedLesson,
    selectedActivity,
    lessonRating,
    isLoading,
    setModuleData,
    isLessonCompleted,
    showModal,
    isPanelClosed,
    selectedLessonHasActivities,
    isCreatingActivity,
    setPanelClosed,
    onSelectActivityId: handleSelectActivityId,
    onToggleModalDisplaying: handleToggleModalDisplaying,
    onClickModalRightButton: handleClickModalRightButton,
    setSelectedLesson: handleLessonSelection,
    onCompleteLesson: handleCompleteLesson,
    onRateContent: handleRateContent,
    onEditRateContent: handleEditRateContent,
    onEnableCourse: handleEnableCourse,
    onDeleteCourse: handleDeleteCourse,
    onCreateActivity: handleCreateActivity,
    onCloseTextEditor: handleCloseTextEditor,
    onActivityCreated: handleActivityCreated,
  };
};

export default useLessonsPreview;
