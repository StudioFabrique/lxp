import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useState, useReducer } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../../../utils/interfaces/lesson-rating";
import toast from "react-hot-toast";
import { Activity } from "../../../utils/interfaces/activity";
import {
  initialLessonsPreviewState,
  lessonsPreviewReducer,
} from "../store/lessons-preview-reducer";

// Hook personnalisé pour la gestion de l'aperçu des leçons destinés à l'apprenant
const useLessonsPreview = () => {
  // Params et states de la route active
  // ------------
  const { moduleId } = useParams();
  const { state: stateFromUrl } = useLocation();
  // ------------
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    lessonsPreviewReducer,
    initialLessonsPreviewState
  );

  const { sendRequest, isLoading } = useHttp(true);

  const [isPanelClosed, setPanelClosed] = useState<boolean>(false);

  // Vérifie si la leçon a déjà été complétée
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Modal management
  const handleToggleModalDisplaying = () => {
    setTimeout(() => {
      setShowModal((prev) => !prev);
    }, 800);
  };

  const handleClickModalRightButton = () => {
    handleCompleteLesson();
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

  // Handler pour marquer une leçon comme terminée
  const handleCompleteLesson = () => {
    // Fonction de mise à jour des données du module
    const applyData = ({ data: lessonRead }: { data: LessonRead }) => {
      if (state.selectedLesson)
        dispatch({
          type: "mark_lesson_as_read",
          lesson: state.selectedLesson,
          lessonRead,
        });
      setIsLessonCompleted(true);
    };

    if (state.selectedLesson)
      sendRequest(
        { path: `/lesson/read/${state.selectedLesson.id}`, method: "put" },
        applyData
      );
  };

  // Effet pour récupérer le contenu de l'activité en cours d'édition
  useEffect(() => {
    /*if (editingActivity?.type === "text" && editingActivity.url) {
      fetch(`${ACTIVITIES}${editingActivity.url}`)
        .then((response) => response.text())
        .then((content: string) => {
          setActivityContent(content);
        });
    } */
  }, []);

  const handleDeleteActivity = useCallback((activity: Activity) => {
    /* sendRequest(
      {
        path: `/activity/${activity.type}/${activityId}/lesson`,
        method: "delete",
      },
      applyData
    ); */
  }, []);

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
      }
    };

    await sendRequest(
      { path: `/course/delete-course/${courseId}`, method: "delete" },
      applyData
    );
  };

  const fetchData = useCallback(() => {
    const applyData = ({ data }: { data: Module }) => {
      dispatch({ type: "update_module_data", module: data });

      if (stateFromUrl?.lessonId) {
        // selectionner la leçon selectionnée depuis le state de l'url
        const lessonToSelect = data.courses
          .flatMap((course) => course.lessons)
          .find((lesson) => lesson.id === stateFromUrl?.lessonId);
        if (lessonToSelect) {
          dispatch({ type: "select_lesson", lesson: lessonToSelect });
        }
      }
    };

    sendRequest({ path: `/modules/detail/limited/${moduleId}` }, applyData);
  }, [moduleId, sendRequest, stateFromUrl?.lessonId]);

  // useEffect pour charger les détails d'une leçon sélectionnée
  useEffect(() => {
    const applyData = (lesson: Lesson) => {
      // Mettre à jour selectedLesson avec les données complètes
      dispatch({ type: "select_lesson", lesson });
    };

    if (!state.selectedLesson?.id) return;
    sendRequest({ path: `/lesson/${state.selectedLesson.id}` }, applyData);
  }, [state.selectedLesson?.id, sendRequest]);

  // useEffect pour charger les données initiales du module
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retourne les données et fonctions nécessaires
  return {
    state,
    dispatch,
    isLoading,
    isPanelClosed,
    fetchData,
    onCompleteLesson: handleCompleteLesson,
    onRateContent: handleRateContent,
    onEnableCourse: handleEnableCourse,
    onDeleteCourse: handleDeleteCourse,
    onDeleteActivity: handleDeleteActivity,
  };
};

export default useLessonsPreview;
