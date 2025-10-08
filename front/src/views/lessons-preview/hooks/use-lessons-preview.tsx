import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useReducer } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../../../utils/interfaces/lesson-rating";
import toast from "react-hot-toast";
import {
  initialLessonsPreviewState,
  lessonsPreviewReducer,
} from "../store/lessons-preview-reducer";
import { ACTIVITIES } from "../../../config/urls";

// Hook personnalisé pour la gestion de l'aperçu des leçons destinés à l'apprenant
const useLessonsPreview = () => {
  // Params et states de la route active
  // ------------
  const { moduleId } = useParams();
  const { state: stateFromUrl } = useLocation();
  // ------------
  // const navigate = useNavigate();
  const { sendRequest, isLoading } = useHttp(true);

  const [state, dispatch] = useReducer(
    lessonsPreviewReducer,
    initialLessonsPreviewState
  );

  const isLessonCompleted = Boolean(
    state.selectedLesson?.lessonsRead?.some(
      (lessonRead) => lessonRead.finishedAt
    )
  );

  const fetchModuleData = useCallback(() => {
    const applyData = ({ data }: { data: Module & { parcours: string } }) => {
      dispatch({ type: "update_module_data", module: data });

      // selectionner la leçon selectionnée depuis le state de l'url
      if (stateFromUrl?.lessonId) {
        dispatch({ type: "select_lesson_by_id", id: stateFromUrl.lessonId });
      }
    };

    sendRequest({ path: `/modules/detail/limited/${moduleId}` }, applyData);
  }, [moduleId, sendRequest, stateFromUrl?.lessonId]);

  const initiateLesson = useCallback(
    async (lessonId: number) => {
      await sendRequest({
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
    };

    if (state.selectedLesson)
      sendRequest(
        { path: `/lesson/read/${state.selectedLesson.id}`, method: "put" },
        applyData
      );
  };

  const handleDeleteActivity = useCallback(() => {
    const applyData = () => {
      dispatch({ type: "delete_selected_activity" });
    };

    if (!state.selectedActivity) return;
    sendRequest(
      {
        path: `/activity/${state.selectedActivity.type}/${state.selectedActivity.id}/lesson`,
        method: "delete",
      },
      applyData
    );
  }, [sendRequest, state.selectedActivity]);

  // Évaluer le cours en tant que apprenant
  const handleRateContent = (mode: "create" | "edit", rating: number) => {
    const applyData = ({ data }: { data: LessonRating }) => {
      dispatch({ type: "set_lesson_rating", rating: data });
    };

    if (mode === "create") {
      // Create rate
      sendRequest(
        {
          method: "post",
          path: `/lesson/rate/${state.selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData
      );
    } else {
      // Edit existing rate
      sendRequest(
        {
          method: "put",
          path: `/lesson/rate/${state.selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData
      );
    }
  };

  const handleEnableCourse = async (courseId: number, visibility: boolean) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        fetchModuleData();
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

  const fetchLessonData = useCallback(async () => {
    const applyData = (lesson: Lesson) => {
      // Mettre à jour selectedLesson avec les données complètes
      dispatch({ type: "select_lesson", lesson });
    };

    if (!state.selectedLesson?.id) return;
    await sendRequest(
      { path: `/lesson/${state.selectedLesson.id}` },
      applyData
    );
    await initiateLesson(state.selectedLesson.id);
  }, [state.selectedLesson?.id, sendRequest, initiateLesson]);

  useEffect(() => {
    // useEffect pour charger les données initiales du module
    fetchModuleData();
  }, [fetchModuleData]);

  useEffect(() => {
    // useEffect pour charger les données et activités
    // d'une nouvelle leçon selectionnée
    fetchLessonData();
  }, [fetchLessonData]);

  useEffect(() => {
    // useEffect pour récupérer le contenu de l'activité selectionnée
    if (state.selectedActivity?.type === "text" && state.selectedActivity.url) {
      fetch(`${ACTIVITIES}${state.selectedActivity.url}`)
        .then((response) => response.text())
        .then((content: string) => {
          dispatch({ type: "update_activity_content", content });
        });
    }
  }, [state.selectedActivity?.type, state.selectedActivity?.url]);

  // Retourne les données et fonctions nécessaires
  return {
    state,
    isLessonCompleted,
    isLoading,
    dispatch,
    fetchModuleData,
    onCompleteLesson: handleCompleteLesson,
    onRateContent: handleRateContent,
    onEnableCourse: handleEnableCourse,
    onDeleteCourse: handleDeleteCourse,
    onDeleteActivity: handleDeleteActivity,
  };
};

export default useLessonsPreview;
