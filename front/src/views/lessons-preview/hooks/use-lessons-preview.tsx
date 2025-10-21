import { useLocation, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useMemo, useReducer } from "react";
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
import { Activity } from "../../../utils/interfaces/activity";

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

  const isLessonCompleted = useMemo(
    () =>
      Boolean(
        state.selectedLesson?.lessonsRead?.some(
          (lessonRead) => lessonRead.finishedAt
        )
      ),
    [state.selectedLesson?.lessonsRead]
  );

  const isFirstActivitySelected = useMemo(
    () =>
      Boolean(
        state.selectedActivity &&
          state.selectedLesson?.activities?.indexOf(state.selectedActivity) ===
            0
      ),
    [state.selectedActivity, state.selectedLesson?.activities]
  );

  const isLastActivitySelected = useMemo(
    () =>
      Boolean(
        state.selectedActivity &&
          state.selectedLesson?.activities?.length &&
          state.selectedLesson.activities.indexOf(state.selectedActivity) ===
            state.selectedLesson.activities.length - 1
      ),
    [state.selectedActivity, state.selectedLesson?.activities]
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

  // Marquer une leçon comme terminée et attribuer une note
  const completeLesson = useCallback(
    (rating: number) => {
      // Fonction de mise à jour des données du module
      const applyData = ({
        lessonRead,
        rating,
      }: {
        lessonRead: LessonRead;
        rating: LessonRating;
      }) => {
        if (state.selectedLesson)
          dispatch({
            type: "mark_lesson_as_read",
            lesson: state.selectedLesson,
            lessonRead,
          });
        dispatch({ type: "set_lesson_rating", rating: [rating] });
      };

      if (state.selectedLesson)
        sendRequest(
          {
            path: `/lesson/read/${state.selectedLesson.id}?rate=${rating}`,
            method: "put",
          },
          applyData
        );
    },
    [sendRequest, state.selectedLesson]
  );

  const deleteActivity = useCallback(() => {
    const applyData = () => {
      dispatch({ type: "delete_selected_activity" });
      toast.success("L'activité a été supprimé");
      dispatch({ type: "set_modal_visibility", modalVisibility: "none" });
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
  const rateContent = useCallback(
    (rating: number) => {
      const applyData = ({ data }: { data: LessonRating }) => {
        dispatch({ type: "set_lesson_rating", rating: [data] });
      };

      // Edit existing rate
      sendRequest(
        {
          method: "put",
          path: `/lesson/rate/${state.selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData
      );
    },
    [sendRequest, state.selectedLesson?.id]
  );

  const enableCourse = useCallback(
    async (courseId: number, visibility: boolean) => {
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
    },
    [fetchModuleData, sendRequest]
  );

  const deleteCourse = useCallback(
    async (courseId: number) => {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
        }
      };

      await sendRequest(
        { path: `/course/delete-course/${courseId}`, method: "delete" },
        applyData
      );
    },
    [sendRequest]
  );

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

  const fetchActivityTextContent = useCallback(() => {
    if (
      state.selectedActivity?.type === "text" &&
      state.selectedActivity?.url &&
      state.mode === "read"
    ) {
      fetch(`${ACTIVITIES}${state.selectedActivity.url}`)
        .then((response) => response.text())
        .then((content: string) => {
          dispatch({ type: "update_activity_content", content });
        });
    }
  }, [state.mode, state.selectedActivity?.type, state.selectedActivity?.url]);

  const saveActivity = async (): Promise<boolean> => {
    if (state.mode === "read") return false;

    const title =
      state.mode === "write"
        ? state.newActivityTitle?.trim()
        : state.selectedActivity?.title;

    // Si le titre est manquant, avertir l'utilisateur via un toast
    if (!title || !(title?.length > 0)) {
      const error = "Le titre est obligatoire";
      toast.error(error);
      dispatch({ type: "set_activity_title_error", error });
      return false;
    }

    if (
      !state.textActivityContent ||
      !(state.textActivityContent?.length > 0)
    ) {
      toast.error("Le contenu est obligatoire");
      return false;
    }

    if (!state.textActivityContent) return false;

    const textContent = state.textActivityContent
      .replace(
        // Supprimer les paragraphes vides au début
        /^(<p><\/p>|<p>\s*<\/p>|<p><br><\/p>)+/,
        ""
      )
      .replace(
        // Supprimer les paragraphes vides à la fin
        /(<p><\/p>|<p>\s*<\/p>|<p><br><\/p>)+$/,
        ""
      );

    const applyDataPost = (activity: Activity) => {
      dispatch({ type: "create_activity", activity });

      return true;
    };

    const applyDataPut = ({ response: activity }: { response: Activity }) => {
      dispatch({ type: "edit_activity", activity });

      return true;
    };

    const response: Promise<boolean> = await sendRequest(
      {
        path: `/activity/text/${
          state.mode === "write"
            ? state.selectedLesson?.id
            : state.selectedActivity?.id
        }`,
        method: state.mode === "write" ? "post" : "put",
        body: {
          description: "description",
          title,
          value: textContent,
          parent: "lesson",
        },
      },
      state.mode === "write" ? applyDataPost : applyDataPut
    );

    // Ajout d'un délai de 1 seconde pour éviter les clignotements
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return response;
  };

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
    fetchActivityTextContent();
  }, [fetchActivityTextContent]);

  // Retourne les données et fonctions nécessaires
  return {
    state,
    isLessonCompleted,
    isFirstActivitySelected,
    isLastActivitySelected,
    isLoading,
    dispatch,
    fetchModuleData,
    onSaveActivity: saveActivity,
    onCompleteLesson: completeLesson,
    onRateContent: rateContent,
    onEnableCourse: enableCourse,
    onDeleteCourse: deleteCourse,
    onDeleteActivity: deleteActivity,
  };
};

export default useLessonsPreview;
