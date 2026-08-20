import { useLocation, useNavigate, useParams } from "react-router";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
  useRef,
  useContext,
} from "react";
import Module from "../../../utils/interfaces/module";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../interfaces/lesson-rating";
import toast from "react-hot-toast";
import {
  initialModuleExplorerContentState,
  moduleExplorerContentReducer,
} from "../store/module-explorer-reducer";
import { ACTIVITIES } from "../../../config/urls";
import { Activity, ActivityType } from "../../../utils/interfaces/activity";
import {
  BaseEventPayload,
  ElementDragType,
} from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { ChatbotContext } from "../../../../src/store/ChatbotProvider";
import { modulePreviewApi } from "../api/module-preview.api";
import type {
  CreateCourseFormValues,
  UpdateCourseFormValues,
} from "../components/sidebar/course-form.types";
import type { LessonFormValues } from "../components/sidebar/lesson-form.types";
import { emitOnboardingEvent } from "../../onboarding/onboarding-events";
import { cleanActivityTextContent } from "../../../utils/helpers/text-helpers";

const useModuleContentExplorer = () => {
  // Le contexte du chatbot
  const { setCurrentActivity } = useContext(ChatbotContext);

  const { moduleId } = useParams();
  const location = useLocation();
  const stateFromUrl = location.state as {
    lessonId?: number;
    activityId?: number;
  } | null;
  const handledLocationKey = useRef<string | undefined>(undefined);
  const isInitialActivityLoaded = useRef(false);
  const isDiagnosticPassed = useRef(false);
  const isReordering = useRef({
    course: false,
    lesson: false,
    activity: false,
  });

  const navigate = useNavigate();
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [state, dispatch] = useReducer(
    moduleExplorerContentReducer,
    initialModuleExplorerContentState,
  );
  const selectedLessonId = state.selectedLesson?.id;
  const selectedActivityId = state.selectedActivity?.id;
  const selectedActivityType = state.selectedActivity?.type;
  const selectedActivityUrl = state.selectedActivity?.url;
  const moduleCourses = state.module?.courses;
  const requestedActivityId =
    stateFromUrl?.lessonId === selectedLessonId
      ? stateFromUrl?.activityId
      : undefined;

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
    if (!activities?.length || !selectedActivityId) return false;

    return activities[0].id === selectedActivityId;
  }, [selectedActivityId, state.selectedLesson?.activities]);

  const isLastActivitySelected = useMemo(() => {
    const activities = state.selectedLesson?.activities;
    if (!activities?.length || !selectedActivityId) return false;

    return activities[activities.length - 1].id === selectedActivityId;
  }, [selectedActivityId, state.selectedLesson?.activities]);

  const isLastLessonSelected = useMemo(() => {
    if (!moduleCourses?.length || !selectedLessonId) return false;

    const lessons = moduleCourses.flatMap((course) => course.lessons);
    const lastLesson = lessons[lessons.length - 1];
    return lastLesson?.id === selectedLessonId;
  }, [moduleCourses, selectedLessonId]);

  const hasNextLesson = useMemo(() => {
    if (!moduleCourses?.length || !selectedLessonId) return false;

    const lessons = moduleCourses.flatMap((course) => course.lessons);
    const currentLessonIndex = lessons.findIndex(
      (lesson) => lesson.id === selectedLessonId,
    );
    return currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1;
  }, [moduleCourses, selectedLessonId]);

  const isLastLessonOfCurrentCourse = useMemo(() => {
    if (!selectedLessonId || !moduleCourses) return false;

    // On trouve le cours auquel appartient la leçon sélectionnée
    const currentCourse = moduleCourses.find((course) =>
      course.lessons.some((lesson) => lesson.id === selectedLessonId),
    );

    if (!currentCourse || !currentCourse.lessons.length) return false;

    // On compare l'ID de la leçon actuelle avec l'ID de la dernière leçon de ce cours
    const lastLessonInCourse =
      currentCourse.lessons[currentCourse.lessons.length - 1];
    return lastLessonInCourse.id === selectedLessonId;
  }, [moduleCourses, selectedLessonId]);

  const fetchModuleData = useCallback(async () => {
    if (!moduleId) return;
    setIsLoadingRequest(true);
    try {
      const { data } = (await modulePreviewApi.queries.getModuleDetail(
        moduleId,
      )) as { data: Module & { parcours: string } };
      dispatch({ type: "update_module_data", module: data });
    } catch {
      // silently fail
    } finally {
      setIsLoadingRequest(false);
    }
  }, [moduleId]);

  const initiateLesson = useCallback(async (lessonId: number) => {
    await modulePreviewApi.tracking.begin("lesson", lessonId);
  }, []);

  // Le suivi de contenu ne doit jamais faire échouer la complétion d'une leçon.
  const finishContent = useCallback(
    (type: "module" | "course" | "lesson", contentId: number) => {
      modulePreviewApi.tracking.finish(type, contentId).catch(() => {});
    },
    [],
  );

  // Handler pour signaler la fin du quiz et enclencher la lecture
  const onFinishInitialQuiz = useCallback(async () => {
    isDiagnosticPassed.current = true;
    if (selectedLessonId) {
      await initiateLesson(selectedLessonId);
    }
  }, [selectedLessonId, initiateLesson]);

  const completeLesson = useCallback(
    async (rating: number) => {
      const lessonId = state.selectedLesson?.id;
      if (state.selectedLesson && lessonId) {
        try {
          // Deux responsabilités distinctes, longtemps servies par la même
          // route historique : clore le suivi de lecture, puis enregistrer la
          // note. `/content-read` porte désormais le suivi pour les quatre
          // niveaux de contenu, la notation reste propre à la leçon.
          const { contentRead: lessonRead } =
            (await modulePreviewApi.tracking.finish("lesson", lessonId)) as {
              contentRead: LessonRead;
            };
          const { data: lessonRating } =
            (await modulePreviewApi.mutations.rateLesson(
              lessonId,
              rating,
            )) as { data: LessonRating };
          dispatch({
            type: "mark_lesson_as_complete",
            lesson: state.selectedLesson,
            lessonRead,
          });
          dispatch({ type: "set_lesson_rating", rating: [lessonRating] });

          // Terminer la dernière leçon d'un cours (ou du module) clôt aussi le
          // niveau au-dessus : sans ça, `finishedAt` resterait toujours nul sur
          // CourseRead et ModuleRead.
          if (isLastLessonOfCurrentCourse && state.selectedLesson.courseId) {
            finishContent("course", state.selectedLesson.courseId);
          }
          if (isLastLessonSelected && state.module?.id) {
            finishContent("module", state.module.id);
          }
        } catch {
          // silently fail
        }
      }
    },
    [
      state.selectedLesson,
      state.module?.id,
      isLastLessonOfCurrentCourse,
      isLastLessonSelected,
      finishContent,
    ],
  );

  const deleteActivity = useCallback(async () => {
    if (!state.selectedActivity) return;
    try {
      await modulePreviewApi.mutations.deleteActivity(
        state.selectedActivity.type,
        state.selectedActivity.id,
      );
      dispatch({ type: "delete_selected_activity" });
      toast.success("L'activité a été supprimé");
      dispatch({ type: "set_modal_visibility", modalVisibility: "none" });
    } catch {
      // silently fail
    }
  }, [state.selectedActivity]);

  const rateContent = useCallback(
    async (rating: number) => {
      try {
        const { data } = (await modulePreviewApi.mutations.updateLessonRating(
          selectedLessonId!,
          rating,
        )) as { data: LessonRating };
        dispatch({ type: "set_lesson_rating", rating: [data] });
      } catch {
        // silently fail
      }
    },
    [selectedLessonId],
  );

  const enableCourse = useCallback(
    async (courseId: number, visibility: boolean) => {
      try {
        const data = await modulePreviewApi.mutations.enableCourse(
          courseId,
          visibility,
        );
        if (data.success) {
          toast.success(data.message);
          fetchModuleData();
        }
      } catch {
        // silently fail
      }
    },
    [fetchModuleData],
  );

  const publishCourse = useCallback(
    async (courseId: number) => {
      try {
        const data = await modulePreviewApi.mutations.publishCourse(courseId);
        if (data.success) {
          toast.success(data.message);
          fetchModuleData();
        }
      } catch {
        // silently fail
      }
    },
    [fetchModuleData],
  );

  const deleteCourse = useCallback(async (courseId: number) => {
    try {
      const data = await modulePreviewApi.mutations.deleteCourse(courseId);
      if (data.success) {
        toast.success(data.message);
        dispatch({ type: "delete_course", id: courseId });
      }
    } catch {
      // silently fail
    }
  }, []);

  const createCourse = useCallback(
    async (values: CreateCourseFormValues): Promise<number | false> => {
      if (!moduleId || !values.title.trim()) return false;
      try {
        const data = await modulePreviewApi.mutations.createCourse({
          title: values.title.trim(),
          moduleId: +moduleId,
        });
        await modulePreviewApi.mutations.updateCourseInfos({
          id: data.course.id,
          title: values.title.trim(),
          description: values.description,
          visibility: values.visibility,
        });
        if (values.tagIds.length > 0) {
          await modulePreviewApi.mutations.setCourseTags(
            data.course.id,
            values.tagIds,
          );
        }
        if (values.lessonTitles.length > 0) {
          const tagId = values.tagIds[0];
          for (const lessonTitle of values.lessonTitles) {
            await modulePreviewApi.mutations.createLesson(data.course.id, {
              title: lessonTitle,
              description: "",
              modalite: "distanciel",
              tagId,
            });
          }
        }
        if (values.lessonIds.length > 0) {
          await modulePreviewApi.mutations.duplicateLessons(
            data.course.id,
            values.lessonIds,
          );
        }
        if (values.resourceIds.length > 0) {
          await modulePreviewApi.mutations.duplicateResources(
            data.course.id,
            values.resourceIds,
          );
        }
        await fetchModuleData();
        toast.success("Cours créé");
        emitOnboardingEvent({ type: "course_created", id: data.course.id });
        return data.course.id;
      } catch {
        toast.error("Impossible de créer le cours");
        return false;
      }
    },
    [fetchModuleData, moduleId],
  );

  const updateCourse = useCallback(
    async (courseId: number, values: UpdateCourseFormValues) => {
      try {
        await modulePreviewApi.mutations.updateCourseInfos({
          id: courseId,
          title: values.title.trim(),
          description: values.description,
          visibility: values.visibility,
        });
        await modulePreviewApi.mutations.setCourseTags(courseId, values.tagIds);
        await fetchModuleData();
        toast.success("Cours mis à jour");
        return true;
      } catch {
        toast.error("Impossible de modifier le cours");
        return false;
      }
    },
    [fetchModuleData],
  );

  const createLesson = useCallback(
    async (
      courseId: number,
      data: LessonFormValues,
    ): Promise<number | false> => {
      if (!data.title.trim() || !data.tagId) return false;
      try {
        const created = await modulePreviewApi.mutations.createLesson(
          courseId,
          { ...data, title: data.title.trim() },
        );
        await fetchModuleData();
        toast.success("Leçon créée");
        emitOnboardingEvent({ type: "lesson_created", id: created.id });
        return created.id;
      } catch {
        toast.error("Impossible de créer la leçon");
        return false;
      }
    },
    [fetchModuleData],
  );

  const updateLesson = useCallback(
    async (lessonId: number, data: LessonFormValues) => {
      if (!data.title.trim() || !data.tagId) return false;
      try {
        await modulePreviewApi.mutations.updateLesson({
          id: lessonId,
          ...data,
          title: data.title.trim(),
          description: data.description.trim(),
        });
        await fetchModuleData();
        toast.success("Leçon mise à jour");
        return true;
      } catch {
        toast.error("Impossible de modifier la leçon");
        return false;
      }
    },
    [fetchModuleData],
  );

  const deleteLesson = useCallback(async (lessonId: number) => {
    try {
      const data = await modulePreviewApi.mutations.deleteLesson(lessonId);
      if (data.success) {
        toast.success(data.message);
        dispatch({ type: "delete_lesson", id: lessonId });
      }
    } catch {
      // silently fail
    }
  }, []);

  const fetchLessonData = useCallback(async () => {
    if (!selectedLessonId) return;

    try {
      const lesson = (await modulePreviewApi.queries.getLesson(
        selectedLessonId,
      )) as Lesson;
      dispatch({
        type: "select_lesson",
        lesson,
        activityId: requestedActivityId,
      });
    } catch {
      // silently fail
    }

    if (isDiagnosticPassed.current) {
      await initiateLesson(selectedLessonId);
    }
  }, [selectedLessonId, requestedActivityId, initiateLesson]);

  const fetchActivityTextContent = useCallback(() => {
    if (
      selectedActivityType === "text" &&
      selectedActivityUrl &&
      state.mode === "read"
    ) {
      fetch(`${ACTIVITIES}${selectedActivityUrl}`)
        .then((response) => response.text())
        .then((content: string) => {
          dispatch({ type: "update_activity_content", content });
        });
    }
  }, [state.mode, selectedActivityType, selectedActivityUrl]);

  const saveTextActivity = async (
    title: string,
    content: string,
  ): Promise<boolean> => {
    if (!content || !(content.length > 0)) {
      toast.error("Le contenu est obligatoire");
      return false;
    }

    const finalContent = cleanActivityTextContent(content);

    setIsLoading(true);

    let response: boolean;
    try {
      if (state.mode === "write") {
        const activity = (await modulePreviewApi.mutations.createTextActivity(
          state.selectedLesson!.id!,
          { title, value: finalContent, parent: "lesson" },
        )) as Activity;
        dispatch({ type: "create_activity", activity });
        emitOnboardingEvent({ type: "activity_created", id: activity.id });
        response = true;
      } else {
        const activity = (
          (await modulePreviewApi.mutations.updateTextActivity(
            state.selectedActivity!.id,
            { title, value: finalContent, parent: "lesson" },
          )) as { response: Activity }
        ).response;
        dispatch({ type: "edit_activity", activity });
        response = true;
      }
    } catch {
      response = false;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    return response;
  };

  const saveIframeActivity = async (title: string): Promise<boolean> => {
    setIsLoading(true);

    let response: boolean;
    try {
      if (state.mode === "write") {
        const activity = (await modulePreviewApi.mutations.createIframeActivity(
          state.selectedLesson!.id!,
          { title, url: state.newActivitySrc },
        )) as Activity;
        dispatch({ type: "create_activity", activity });
        response = true;
      } else {
        const activity = (await modulePreviewApi.mutations.updateIframeActivity(
          state.selectedActivity!.id,
          { title, url: state.selectedActivity?.url },
        )) as Activity;
        dispatch({ type: "edit_activity", activity });
        response = true;
      }
    } catch {
      response = false;
    }

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
        : state.selectedActivity?.title?.trim();
    const activityType =
      state.mode === "write" ? state.activityType : state.selectedActivity?.type;

    if (!title) {
      const error = "Le titre est obligatoire";
      toast.error(error);
      dispatch({ type: "set_activity_title_error", error });
      return false;
    }

    switch (activityType) {
      case "text":
        return await saveTextActivity(title, content ?? "");
      case "iframe":
        return await saveIframeActivity(title);
      default:
        return false;
    }
  };

  const activityReorder = async ({
    source,
    location,
  }: BaseEventPayload<ElementDragType>) => {
    if (isReordering.current.activity) {
      toast("Veuillez patienter");
      return;
    }

    // Extraction des index depuis les données attachées aux éléments
    const fromId = source.data.index as number;

    const destination = location.current.dropTargets[0];

    if (!destination) return;

    const toId = destination.data.index as number;

    if (fromId === undefined || toId === undefined || fromId === toId) return;

    dispatch({ type: "reorder_activity", fromId, toId });

    isReordering.current.activity = true;

    if (state.selectedLesson && state.selectedLesson.activities) {
      const reorderedActivities = Array.from(state.selectedLesson.activities);
      const [movedItem] = reorderedActivities.splice(fromId, 1);
      reorderedActivities.splice(toId, 0, movedItem);

      const newActivitiesIds = reorderedActivities.map(
        (activity) => activity.id,
      );

      try {
        await modulePreviewApi.mutations.reorderActivities(
          state.selectedLesson.id!,
          newActivitiesIds,
        );
      } catch {
        // silently fail
      } finally {
        isReordering.current.activity = false;
      }
    } else {
      isReordering.current.activity = false;
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
    if (
      !state.module ||
      String(state.module.id) !== moduleId ||
      handledLocationKey.current === location.key
    )
      return;

    if (stateFromUrl?.lessonId) {
      dispatch({
        type: "select_content_by_id",
        lessonId: stateFromUrl.lessonId,
        activityId: stateFromUrl.activityId,
      });
    }
    handledLocationKey.current = location.key;
  }, [
    location.key,
    moduleId,
    state.module,
    stateFromUrl?.activityId,
    stateFromUrl?.lessonId,
  ]);

  useEffect(() => {
    // Le changement de module déclenche volontairement un nouveau chargement.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchModuleData();
  }, [fetchModuleData]);

  useEffect(() => {
    fetchLessonData();
  }, [fetchLessonData]);

  useEffect(() => {
    fetchActivityTextContent();
  }, [fetchActivityTextContent]);

  // If a activity is selected, select the title of the current course and set the chatbot activity name
  useEffect(() => {
    if (
      state.selectedLesson?.courseId &&
      state.selectedActivity?.type === "text" &&
      state.module?.courses
    ) {
      // Cherche le cours actuel dans la liste du module
      const currentCourse = state.module.courses.find(
        (course) => course.id === state.selectedLesson?.courseId,
      );

      // Attribue le titre du cours au chatbot
      if (currentCourse?.title) {
        setCurrentActivity((prev) => ({
          ...prev,
          courseId: currentCourse.id,
          content: state.textActivityContent,
        }));
      }
    }
  }, [
    setCurrentActivity,
    state.selectedLesson?.courseId,
    state.selectedActivity?.type,
    state.module?.courses,
    state.textActivityContent,
  ]);

  return {
    state,
    computed: {
      isLessonCompleted,
      isFirstActivitySelected,
      isLastActivitySelected,
      isLastLessonSelected,
      hasNextLesson,
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
      publishCourse,
      deleteCourse,
      createCourse,
      updateCourse,
    },
    lessonActions: {
      completeLesson,
      rateContent,
      deleteLesson,
      nextLesson,
      createLesson,
      updateLesson,
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
