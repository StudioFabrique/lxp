import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../../../utils/interfaces/lesson-rating";
import toast from "react-hot-toast";
import {
  initialModuleExplorerContentState,
  moduleExplorerContentReducer,
} from "../store/module-explorer-reducer";
import { ACTIVITIES } from "../../../config/urls";
import { Activity, ActivityType } from "../../../utils/interfaces/activity";
import { OnDragEndResponder } from "react-beautiful-dnd";
import { replaceActivityTextContent } from "../../../helpers/replaceActivityTextContent";

// Hook personnalisé pour la gestion de l'aperçu des leçons destinés à l'apprenant
const useModuleExplorerContent = () => {
  // Params et states de la route active
  // ------------
  const { moduleId } = useParams();
  const { state: stateFromUrl }: { state: { lessonId?: number } } =
    useLocation();
  const [stateFromUrlCalled, setStateFromUrlCalled] = useState(false);
  // ------------
  const navigate = useNavigate();
  const { sendRequest, isLoading } = useHttp(true);

  const [state, dispatch] = useReducer(
    moduleExplorerContentReducer,
    initialModuleExplorerContentState
  );

  const [hasOrderChanged, setOrderChanged] = useState({
    course: false,
    lesson: false,
    activity: false,
  });

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
          state.selectedLesson?.activities &&
          state.selectedLesson.activities.indexOf(state.selectedActivity) ===
            state.selectedLesson.activities.length - 1
      ),
    [state.selectedActivity, state.selectedLesson?.activities]
  );

  const isLastLessonSelected = useMemo(
    () =>
      Boolean(
        ((state.selectedLesson &&
          state.module?.courses.flatMap((course) => course.lessons).length) ||
          0) -
          1 ===
          state.module?.courses
            .flatMap((course) => course.lessons)
            .findIndex((lesson) => lesson.id === state.selectedLesson?.id)
      ),
    [state.module?.courses, state.selectedLesson]
  );

  const fetchModuleData = useCallback(() => {
    const applyData = ({ data }: { data: Module & { parcours: string } }) => {
      dispatch({ type: "update_module_data", module: data });
    };

    sendRequest({ path: `/modules/detail/limited/${moduleId}` }, applyData);
  }, [moduleId, sendRequest]);

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
        if (state.selectedLesson) {
          dispatch({
            type: "mark_lesson_as_complete",
            lesson: state.selectedLesson,
            lessonRead,
          });
          dispatch({ type: "set_lesson_rating", rating: [rating] });
        }
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
          dispatch({ type: "delete_course", id: courseId });
        }
      };

      await sendRequest(
        { path: `/course/delete-course/${courseId}`, method: "delete" },
        applyData
      );
    },
    [sendRequest]
  );

  const deleteLesson = useCallback(
    async (lessonId: number) => {
      const applyData = (data: { success: boolean; message: string }) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({ type: "delete_lesson", id: lessonId });
        }
      };
      await sendRequest(
        { path: `/lesson/${lessonId}`, method: "delete" },
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
    navigate(".", {
      state: { lessonId: state.selectedLesson.id },
    });
    await sendRequest(
      { path: `/lesson/${state.selectedLesson.id}` },
      applyData
    );
    await initiateLesson(state.selectedLesson.id);
  }, [state.selectedLesson?.id, sendRequest, initiateLesson, navigate]);

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

  const saveTextActivity = async (title: string): Promise<boolean> => {
    // Si le titre est manquant, avertir l'utilisateur via un toast

    if (
      !state.textActivityContent ||
      !(state.textActivityContent?.length > 0)
    ) {
      toast.error("Le contenu est obligatoire");
      return false;
    }

    if (!state.textActivityContent) return false;

    // clean empty div at the content beginning and the end
    const textContent = replaceActivityTextContent(state.textActivityContent);

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

  const saveIframeActivity = async (title: string): Promise<boolean> => {
    const applyDataPost = (activity: Activity) => {
      dispatch({ type: "create_activity", activity });

      return true;
    };

    const applyDataPut = (activity: Activity) => {
      dispatch({ type: "edit_activity", activity });

      return true;
    };

    const response: Promise<boolean> = await sendRequest(
      {
        path: `/activity/iframe/${
          state.mode === "write"
            ? state.selectedLesson?.id
            : state.selectedActivity?.id
        }`,
        method: state.mode === "write" ? "post" : "put",
        body: {
          description: "description",
          title,
          url:
            state.mode === "write"
              ? state.newActivitySrc
              : state.selectedActivity?.url,
        },
      },
      state.mode === "write" ? applyDataPost : applyDataPut
    );

    // Ajout d'un délai de 1 seconde pour éviter les clignotements
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return response;
  };

  const saveActivity = async (): Promise<boolean> => {
    if (state.mode === "read") return false;

    const title =
      state.mode === "write"
        ? state.newActivityTitle?.trim()
        : state.selectedActivity?.title;

    if (!title || !(title?.length > 0)) {
      const error = "Le titre est obligatoire";
      toast.error(error);
      dispatch({ type: "set_activity_title_error", error });
      return false;
    }

    switch (
      state.mode === "write" ? state.activityType : state.selectedActivity?.type
    ) {
      case "text":
        return await saveTextActivity(title);
      case "iframe":
        return await saveIframeActivity(title);
      default:
        return false;
    }
  };

  const activityReorder: OnDragEndResponder = (result) => {
    if (hasOrderChanged.activity) {
      toast("Veuillez patienter");
      return;
    }
    const fromId = result.source.index;
    const toId = result.destination?.index;

    if (toId === undefined) return;

    dispatch({ type: "reorder_activity", fromId, toId });
    setOrderChanged((prev) => ({ ...prev, activity: true }));
  };

  const lessonReorder: OnDragEndResponder = (result) => {
    if (hasOrderChanged.activity) {
      toast("Veuillez patienter");
      return;
    }
    const fromId = result.source.index;
    const toId = result.destination?.index;

    if (toId === undefined) return;

    dispatch({ type: "reorder_lesson", fromId, toId });
    setOrderChanged((prev) => ({ ...prev, lesson: true }));
  };

  const nextLesson = () => {
    dispatch({ type: "go_to_next_lesson" });
  };

  const selectActivityType = (activityType: ActivityType) => {
    switch (activityType) {
      case "text":
      case "iframe":
        return dispatch({
          type: "select_mode",
          mode: "write",
          activityType,
        });
      case "video":
        return navigate(
          `/admin/lesson/edit/${state.selectedLesson?.id}?type=video`
        );
      case "image":
        return navigate(
          `/admin/lesson/edit/${state.selectedLesson?.id}?type=image`
        );
      case "resource":
        return navigate(
          `/admin/lesson/edit/${state.selectedLesson?.id}?type=resource`
        );
    }
  };

  useEffect(() => {
    // selectionner la leçon selectionnée depuis le state de l'url dès que les données du module sont fetch,
    // une seule fois
    if (state.module && !stateFromUrlCalled) {
      if (stateFromUrl?.lessonId)
        dispatch({ type: "select_lesson_by_id", id: stateFromUrl.lessonId });
      setStateFromUrlCalled(true);
    }
  }, [state.module, stateFromUrl?.lessonId, stateFromUrlCalled]);

  useEffect(() => {
    if (
      hasOrderChanged.activity &&
      state.selectedLesson &&
      state.selectedLesson.activities
    ) {
      const applyData = () => {
        setOrderChanged((prev) => ({ ...prev, activity: false }));
      };

      sendRequest(
        {
          path: `/activity/reorder/${state.selectedLesson.id}`,
          method: "put",
          body: state.selectedLesson.activities.map((activity) => activity.id),
        },
        applyData
      );
    }
    if (hasOrderChanged.lesson && state.module) {
      const applyData = () => {
        setOrderChanged((prev) => ({ ...prev, lesson: false }));
      };

      sendRequest(
        {
          path: `/lesson/reorder/${state.selectedLesson?.course.id}`,
          method: "put",
          body: state.module.courses
            .find((course) => state.selectedLesson?.course.id === course.id)
            ?.lessons.map((lesson) => lesson.id),
        },
        applyData
      );
    }
  }, [sendRequest, hasOrderChanged, state.selectedLesson, state.module]);

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
    isLastLessonSelected,
    isLoading,
    dispatch,
    fetchModuleData,
    onSaveActivity: saveActivity,
    onCompleteLesson: completeLesson,
    onRateContent: rateContent,
    onEnableCourse: enableCourse,
    onDeleteCourse: deleteCourse,
    onDeleteLesson: deleteLesson,
    onDeleteActivity: deleteActivity,
    onActivityReorder: activityReorder,
    onLessonReorder: lessonReorder,
    onNextLesson: nextLesson,
    onSelectActivityType: selectActivityType,
  };
};

export default useModuleExplorerContent;
