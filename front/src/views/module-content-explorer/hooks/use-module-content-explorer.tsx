import { useLocation, useNavigate, useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
} from "react";
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

const useModuleContentExplorer = () => {
  const { moduleId } = useParams();
  const { state: stateFromUrl }: { state: { lessonId?: number } } =
    useLocation();
  const stateFromUrlCalled = useRef(false);
  const isInitialActivityLoaded = useRef(false);
  // Réf pour bloquer l'initiation de la leçon tant que le quiz n'est pas fini
  const isDiagnosticPassed = useRef(false);
  const isReordering = useRef({
    course: false,
    lesson: false,
    activity: false,
  });

  const navigate = useNavigate();
  const { sendRequest, isLoading: isLoadingRequest } = useHttp(true);
  const [isLoading, setIsLoading] = useState(false);

  const [state, dispatch] = useReducer(
    moduleExplorerContentReducer,
    initialModuleExplorerContentState,
  );

  const hasStartedModule = useMemo(() => {
    if (!state.module) return false;
    return state.module.courses.some((course) =>
      course.lessons.some(
        (lesson) => lesson.lessonsRead && lesson.lessonsRead.length > 0,
      ),
    );
  }, [state.module]);

  const isLessonCompleted = useMemo(
    () =>
      Boolean(
        state.selectedLesson?.lessonsRead?.some(
          (lessonRead) => lessonRead.finishedAt,
        ),
      ),
    [state.selectedLesson?.lessonsRead],
  );

  const isFirstActivitySelected = useMemo(() => {
    const activities = state.selectedLesson?.activities;
    if (!activities?.length || !state.selectedActivity?.id) return false;

    return activities[0].id === state.selectedActivity.id;
  }, [state.selectedActivity?.id, state.selectedLesson?.activities]);

  const isLastActivitySelected = useMemo(() => {
    const activities = state.selectedLesson?.activities;
    if (!activities?.length || !state.selectedActivity?.id) return false;

    return activities[activities.length - 1].id === state.selectedActivity.id;
  }, [state.selectedActivity?.id, state.selectedLesson?.activities]);

  const isLastLessonSelected = useMemo(() => {
    if (!state.module?.courses?.length || !state.selectedLesson?.id)
      return false;

    const courses = state.module.courses;
    const lastCourse = courses[courses.length - 1]; // Le dernier cours

    if (!lastCourse.lessons?.length) return false;

    const lastLesson = lastCourse.lessons[lastCourse.lessons.length - 1]; // La dernière leçon de ce cours

    // On compare juste les IDs
    return lastLesson.id === state.selectedLesson.id;
  }, [state.module?.courses, state.selectedLesson?.id]);

  const isLastLessonOfCurrentCourse = useMemo(() => {
    if (!state.selectedLesson || !state.module) return false;

    // On trouve le cours auquel appartient la leçon sélectionnée
    const currentCourse = state.module.courses.find((course) =>
      course.lessons.some((lesson) => lesson.id === state.selectedLesson?.id),
    );

    if (!currentCourse || !currentCourse.lessons.length) return false;

    // On compare l'ID de la leçon actuelle avec l'ID de la dernière leçon de ce cours
    const lastLessonInCourse =
      currentCourse.lessons[currentCourse.lessons.length - 1];
    return lastLessonInCourse.id === state.selectedLesson.id;
  }, [state.selectedLesson, state.module]);

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
    [sendRequest],
  );

  // Handler pour signaler la fin du quiz et enclencher la lecture
  const onFinishInitialQuiz = useCallback(async () => {
    isDiagnosticPassed.current = true;
    if (state.selectedLesson?.id) {
      await initiateLesson(state.selectedLesson.id);
    }
  }, [state.selectedLesson?.id, initiateLesson]);

  const completeLesson = useCallback(
    (rating: number) => {
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
          applyData,
        );
    },
    [sendRequest, state.selectedLesson],
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
      applyData,
    );
  }, [sendRequest, state.selectedActivity]);

  const rateContent = useCallback(
    (rating: number) => {
      const applyData = ({ data }: { data: LessonRating }) => {
        dispatch({ type: "set_lesson_rating", rating: [data] });
      };

      sendRequest(
        {
          method: "put",
          path: `/lesson/rate/${state.selectedLesson?.id}`,
          body: { rate: rating },
        },
        applyData,
      );
    },
    [sendRequest, state.selectedLesson?.id],
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
        applyData,
      );
    },
    [fetchModuleData, sendRequest],
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
        applyData,
      );
    },
    [sendRequest],
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
        applyData,
      );
    },
    [sendRequest],
  );

  const fetchLessonData = useCallback(async () => {
    const applyData = (lesson: Lesson) => {
      dispatch({ type: "select_lesson", lesson });
    };

    if (!state.selectedLesson?.id) return;
    navigate(".", {
      state: { lessonId: state.selectedLesson.id },
    });

    await sendRequest(
      { path: `/lesson/${state.selectedLesson.id}` },
      applyData,
    );

    // Déclenche automatiquement si le quiz est passé ou bypassé
    if (isDiagnosticPassed.current) {
      await initiateLesson(state.selectedLesson.id);
    }
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

  const saveTextActivity = async (
    title: string,
    content: string,
  ): Promise<boolean> => {
    if (!content || !(content.length > 0)) {
      toast.error("Le contenu est obligatoire");
      return false;
    }

    const finalContent = replaceActivityTextContent(content);

    const applyDataPost = (activity: Activity) => {
      dispatch({ type: "create_activity", activity });
      return true;
    };

    const applyDataPut = ({ response: activity }: { response: Activity }) => {
      dispatch({ type: "edit_activity", activity });
      return true;
    };

    setIsLoading(true);

    const response: Promise<boolean> = await sendRequest(
      {
        path: `/activity/text/${
          state.mode === "write"
            ? state.selectedLesson?.id
            : state.selectedActivity?.id
        }`,
        method: state.mode === "write" ? "post" : "put",
        body: {
          title,
          value: finalContent,
          parent: "lesson",
        },
      },
      state.mode === "write" ? applyDataPost : applyDataPut,
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
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

    setIsLoading(true);

    const response: Promise<boolean> = await sendRequest(
      {
        path: `/activity/iframe/${
          state.mode === "write"
            ? state.selectedLesson?.id
            : state.selectedActivity?.id
        }`,
        method: state.mode === "write" ? "post" : "put",
        body: {
          title,
          url:
            state.mode === "write"
              ? state.newActivitySrc
              : state.selectedActivity?.url,
        },
      },
      state.mode === "write" ? applyDataPost : applyDataPut,
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    return response;
  };

  const saveActivity = async (
    _id?: number | undefined,
    _title?: string | undefined,
    content?: string | undefined,
  ): Promise<boolean> => {
    if (state.mode === "read") return false;

    const title =
      state.mode === "write"
        ? state.newActivityTitle?.trim()
        : state.selectedActivity?.title;

    if (!title || !(title?.length > 0) || !content) {
      const error = "Le titre est obligatoire";
      toast.error(error);
      dispatch({ type: "set_activity_title_error", error });
      return false;
    }

    switch (
      state.mode === "write" ? state.activityType : state.selectedActivity?.type
    ) {
      case "text":
        return await saveTextActivity(title, content);
      case "iframe":
        return await saveIframeActivity(title);
      default:
        return false;
    }
  };
  const activityReorder: OnDragEndResponder = (result) => {
    if (isReordering.current.activity) {
      toast("Veuillez patienter");
      return;
    }
    const fromId = result.source.index;
    const toId = result.destination?.index;

    if (toId === undefined) return;

    dispatch({ type: "reorder_activity", fromId, toId });

    isReordering.current.activity = true;

    if (state.selectedLesson && state.selectedLesson.activities) {
      sendRequest(
        {
          path: `/activity/reorder/${state.selectedLesson.id}`,
          method: "put",
          body: {
            activitiesIds: state.selectedLesson.activities.map(
              (activity) => activity.id,
            ),
          },
        },
        () => {
          isReordering.current.activity = false;
        },
      );
    }
  };

  const lessonReorder: OnDragEndResponder = (result) => {
    if (isReordering.current.lesson) {
      toast("Veuillez patienter");
      return;
    }

    const fromId = result.source.index;
    const toId = result.destination?.index;

    if (toId === undefined || fromId === toId) return;

    dispatch({ type: "reorder_lesson", fromId, toId });

    isReordering.current.lesson = true;

    const currentCourse = state.module?.courses.find(
      (course) => state.selectedLesson?.course.id === course.id,
    );

    if (currentCourse && state.selectedLesson) {
      const reorderedLessons = Array.from(currentCourse.lessons);
      const [movedItem] = reorderedLessons.splice(fromId, 1);
      reorderedLessons.splice(toId, 0, movedItem);

      const newLessonIds = reorderedLessons.map((lesson) => lesson.id);

      sendRequest(
        {
          path: `/lesson/reorder/${state.selectedLesson.course.id}`,
          method: "put",
          body: newLessonIds,
        },
        () => {
          isReordering.current.lesson = false;
        },
      );
    } else {
      isReordering.current.lesson = false;
    }
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
          `/admin/lesson/edit/${state.selectedLesson?.id}?type=video`,
        );
      case "image":
        return navigate(
          `/admin/lesson/edit/${state.selectedLesson?.id}?type=image`,
        );
      case "resource":
        return navigate(
          `/admin/lesson/edit/${state.selectedLesson?.id}?type=resource`,
        );
    }
  };

  const scrollTopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!state.selectedActivity?.id) return;

    if (!isInitialActivityLoaded.current) {
      isInitialActivityLoaded.current = true;
      return;
    }

    if (scrollTopRef.current) {
      setTimeout(() => {
        scrollTopRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [state.selectedActivity?.id]);

  useEffect(() => {
    if (state.module && !stateFromUrlCalled.current) {
      if (stateFromUrl?.lessonId)
        dispatch({ type: "select_lesson_by_id", id: stateFromUrl.lessonId });
      stateFromUrlCalled.current = true;
    }
  }, [state.module, stateFromUrl?.lessonId]);

  useEffect(() => {
    fetchModuleData();
  }, [fetchModuleData]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  useEffect(() => {
    fetchActivityTextContent();
  }, [fetchActivityTextContent]);

  return {
    state,
    computed: {
      isLessonCompleted,
      isFirstActivitySelected,
      isLastActivitySelected,
      isLastLessonSelected,
      hasStartedModule,
      isLastLessonOfCurrentCourse,
    },
    isLoading: isLoading || isLoadingRequest,
    dispatch,
    moduleActions: {
      fetchModuleData,
      onFinishInitialQuiz,
    },
    courseActions: {
      enableCourse,
      deleteCourse,
    },
    lessonActions: {
      completeLesson,
      rateContent,
      deleteLesson,
      lessonReorder,
      nextLesson,
    },
    activityActions: {
      saveActivity,
      deleteActivity,
      activityReorder,
      selectActivityType,
    },
    scrollTopRef,
  };
};

export default useModuleContentExplorer;
