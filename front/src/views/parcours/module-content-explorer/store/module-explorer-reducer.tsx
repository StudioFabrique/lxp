import { Activity, ActivityType } from "../../../../utils/interfaces/activity";
import Course from "../../../../utils/interfaces/course";
import Lesson from "../../../../utils/interfaces/lesson";
import LessonRating from "../../../../utils/interfaces/lesson-rating";
import LessonRead from "../../../../utils/interfaces/lesson-read";
import Module from "../../../../utils/interfaces/module";

// Identifiant de clé pour stocker la valeur permettant de savoir si le panneau latéral a été fermé par l'utilisateur
const STORAGE_KEY = "lessons-preview-panel-closed";

type ModalVisibility = "deletionModal" | "lessonCompletionModal" | "none";

export type ActivitySelectMode =
  | "read"
  | "edit"
  | "write"
  | "activity_type_selection";

// Propriétés qui sont disponibles à la modification et à la lecture sans conditions préalables
type StaticStateProperties = {
  isPanelClosed: boolean;
  modalVisibility: ModalVisibility;
  module?: Module & { parcours: string };
  selectedLesson?: Lesson;
  selectedActivity?: Activity;
  textActivityContent?: string;
};

// Propriétés qui sont disponibles à la modification et à la lecture selon le mode (lecture, édition ou écriture)
type ConditionnalStateProperties =
  | {
      mode: "read";
      // rajouter les propriétés supplémentaires pour le mode "read"
    }
  | {
      mode: "activity_type_selection";
      // rajouter les propriétés supplémentaires pour le mode "type_selection"
    }
  | {
      mode: "edit";
      // rajouter les propriétés supplémentaires pour le mode "edit"
      titleError?: string;
    }
  | {
      mode: "write";
      // rajouter les propriétés supplémentaires pour le mode "write"
      newActivityTitle?: string;
      titleError?: string;
      newActivitySrc?: string;
      activityType?: ActivityType;
    };

// Le type du state du reducer
type ModuleExplorerContentState = StaticStateProperties &
  ConditionnalStateProperties;

type ModuleExplorerContentAction =
  // Module
  | { type: "update_module_data"; module: Module & { parcours: string } }
  // Course
  | { type: "set_course_visibility"; isVisible: boolean; course: Course }
  | { type: "delete_course"; id: number }
  // Lesson
  | { type: "select_lesson"; lesson?: Lesson }
  | { type: "select_lesson_by_id"; id: number }
  | { type: "set_lesson_rating"; rating: LessonRating[] }
  | { type: "mark_lesson_as_complete"; lesson: Lesson; lessonRead: LessonRead }
  | { type: "go_to_next_lesson" }
  | { type: "delete_lesson"; id: number }
  | { type: "reorder_lesson"; fromId: number; toId: number }
  // Activity
  | { type: "select_activity"; activity?: Activity }
  | { type: "select_last_activity_from_current_lesson" }
  | { type: "create_activity"; activity?: Activity }
  | { type: "edit_activity"; activity?: Activity }
  | { type: "delete_selected_activity" }
  | { type: "update_activity_title"; title: string }
  | { type: "set_activity_title_error"; error?: string }
  | { type: "update_activity_content"; content: string }
  | { type: "update_activity_iframe_src"; src: string }
  | { type: "go_to_previous_activity" }
  | { type: "go_to_next_activity" }
  | { type: "reorder_activity"; fromId: number; toId: number }
  // Miscellaneous
  // Note concernant "select_mode" : type_selection fait référence au moment durant lequel l'utilisateur selectionne son type d'activité
  | {
      type: "select_mode";
      mode: ActivitySelectMode;
      activityType?: ActivityType;
    }
  | { type: "toggle_panel_visibility" }
  | { type: "set_modal_visibility"; modalVisibility: ModalVisibility };

const stored = localStorage.getItem(STORAGE_KEY);

export const initialModuleExplorerContentState: ModuleExplorerContentState = {
  mode: "read",
  isPanelClosed: stored ? JSON.parse(stored) : false,
  modalVisibility: "none",
};

export function moduleExplorerContentReducer(
  state: ModuleExplorerContentState,
  action: ModuleExplorerContentAction,
): ModuleExplorerContentState {
  switch (action.type) {
    // --- Module ---
    case "update_module_data":
      return { ...state, module: action.module };

    // --- Course ---
    case "set_course_visibility": {
      // Pour le cours selectionné, définir la visibilité
      if (!state.module) return state;
      const courses = state.module.courses.map((course) =>
        course.id === action.course.id
          ? { ...course, visibility: action.isVisible }
          : course,
      );

      return {
        ...state,
        module: {
          ...state.module,
          courses,
        },
      };
    }

    case "delete_course":
      return {
        ...state,
        module: state.module && {
          ...state.module,
          courses:
            state.module?.courses.filter((course) => course.id !== action.id) ||
            [],
        },
        selectedActivity: undefined,
        selectedLesson: undefined,
      };

    // --- Lesson ---
    case "select_lesson": {
      const selectedActivity = action.lesson?.activities?.[0];

      return {
        ...state,
        mode: "read",
        selectedLesson: action.lesson,
        selectedActivity,
      };
    }

    case "select_lesson_by_id": {
      // Selectionne la leçon par son id
      const { module } = state;

      if (!module) return state;
      const selectedLesson = module.courses
        .flatMap((course) => course.lessons)
        .find((lesson) => lesson.id === action.id);

      return {
        ...state,
        selectedLesson,
      };
    }

    case "set_lesson_rating":
      if (!state.selectedLesson) return state;
      return {
        ...state,
        selectedLesson: {
          ...state.selectedLesson,
          lessonRating: action.rating,
        },
      };

    case "mark_lesson_as_complete": {
      if (!state.module) return state;

      const courses = state.module.courses.map((course) => ({
        ...course,
        lessons: course.lessons.map((lesson) => {
          if (lesson.id === action.lesson.id) {
            return {
              ...lesson,
              lessonsRead: [...(lesson.lessonsRead || []), action.lessonRead],
            };
          }
          return lesson;
        }),
      }));

      const updatedLesson =
        state.selectedLesson && state.selectedLesson.id === action.lesson.id
          ? {
              ...state.selectedLesson,
              lessonsRead: [
                ...(state.selectedLesson.lessonsRead || []),
                action.lessonRead,
              ],
              activities:
                state.selectedLesson.activities ??
                action.lesson.activities ??
                [],
            }
          : state.selectedLesson;

      return {
        ...state,
        module: {
          ...state.module,
          courses,
        },
        selectedLesson: updatedLesson,
      };
    }

    case "go_to_next_lesson": {
      const { selectedLesson, module } = state;

      if (!(selectedLesson && selectedLesson.id && module)) return state;

      const allLessons = module.courses.flatMap((course) => course.lessons);
      const currentLessonIndex = allLessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id,
      );
      const nextLesson = allLessons[currentLessonIndex + 1];

      return {
        ...state,
        selectedLesson: nextLesson,
        mode: "read",
        modalVisibility: "none",
      };
    }

    case "delete_lesson":
      return {
        ...state,
        selectedActivity: undefined,
        selectedLesson: undefined,
        module: state.module && {
          ...state.module,
          courses:
            state.module?.courses.map((course) => ({
              ...course,
              lessons: course.lessons.filter(
                (lesson) => lesson.id !== action.id,
              ),
            })) || [],
        },
      };

    case "reorder_lesson": {
      if (!state.module) return state;

      const courses = state.module.courses.map((course) => ({ ...course }));

      // Trouver la leçon à déplacer et le cours où elle se trouve
      let fromCourseIndex, fromLessonIndex, lessonToMove;
      for (let i = 0; i < courses.length; i++) {
        const lessonIndex = courses[i].lessons.findIndex(
          (l) => l.id === action.fromId,
        );
        if (lessonIndex !== -1) {
          fromCourseIndex = i;
          fromLessonIndex = lessonIndex;
          lessonToMove = courses[i].lessons[lessonIndex];
          break;
        }
      }

      if (!lessonToMove) return state; // leçon non trouvée

      // Trouver la cible (toId)
      let toCourseIndex, toLessonIndex;
      for (let i = 0; i < courses.length; i++) {
        const lessonIndex = courses[i].lessons.findIndex(
          (l) => l.id === action.toId,
        );
        if (lessonIndex !== -1) {
          toCourseIndex = i;
          toLessonIndex = lessonIndex;
          break;
        }
      }

      if (
        !(fromCourseIndex && fromLessonIndex && toLessonIndex && toCourseIndex)
      )
        return state;

      // Retirer la leçon de son ancien cours
      courses[fromCourseIndex].lessons.splice(fromLessonIndex, 1);

      // Si même cours → insérer à la nouvelle position
      if (fromCourseIndex === toCourseIndex) {
        courses[toCourseIndex].lessons.splice(toLessonIndex, 0, lessonToMove);
      } else {
        // Si changement de cours → insérer dans le nouveau cours
        courses[toCourseIndex].lessons.splice(toLessonIndex, 0, lessonToMove);
      }

      return {
        ...state,
        module: {
          ...state.module,
          courses,
        },
      };
    }

    // --- Activity ---
    case "select_activity":
      return { ...state, mode: "read", selectedActivity: action.activity };

    case "select_last_activity_from_current_lesson": {
      const currentActivities = state.selectedLesson?.activities;
      if (!currentActivities) return state;
      const lastActivity = currentActivities[currentActivities.length - 1];
      return { ...state, mode: "read", selectedActivity: lastActivity };
    }

    case "create_activity": {
      if (!(action.activity && state.selectedLesson && state.mode === "write"))
        return state;

      const activities = [
        ...(state.selectedLesson.activities || []),
        action.activity,
      ];

      return {
        ...state,
        selectedLesson: { ...state.selectedLesson, activities },
        selectedActivity: action.activity,
      };
    }

    case "edit_activity": {
      if (!(action.activity && state.selectedLesson && state.selectedActivity))
        return state;

      const activities = state.selectedLesson.activities?.map((activity) =>
        activity.id === action.activity?.id ? action.activity : activity,
      );

      return {
        ...state,
        selectedLesson: { ...state.selectedLesson, activities },
        selectedActivity: action.activity,
      };
    }

    case "delete_selected_activity": {
      if (!state.selectedActivity?.id || !state.selectedLesson) return state;
      const activities = state.selectedLesson?.activities?.filter(
        (activity) => state.selectedActivity?.id !== activity.id,
      );
      const selectedActivity = activities?.[0];

      return {
        ...state,
        selectedLesson: {
          ...state.selectedLesson,
          activities,
        },
        selectedActivity,
      };
    }

    case "update_activity_title":
      if (state.mode === "read" || state.mode === "activity_type_selection")
        return state;
      if (state.mode === "write") {
        return {
          ...state,
          newActivityTitle: action.title,
          titleError: undefined,
        };
      } else {
        if (!state.selectedActivity) return state;
        return {
          ...state,
          selectedActivity: {
            ...state.selectedActivity,
            title: action.title,
          },
          titleError: undefined,
        };
      }

    case "set_activity_title_error":
      if (state.mode === "read" || state.mode === "activity_type_selection")
        return state;
      return { ...state, titleError: action.error };

    case "update_activity_content":
      return { ...state, textActivityContent: action.content };

    case "update_activity_iframe_src":
      if (state.mode === "read" || state.mode === "activity_type_selection")
        return state;
      if (state.mode === "write") {
        return {
          ...state,
          newActivitySrc: action.src,
          titleError: undefined,
        };
      } else {
        if (!state.selectedActivity) return state;
        return {
          ...state,
          selectedActivity: {
            ...state.selectedActivity,
            url: action.src,
          },
          titleError: undefined,
        };
      }

    case "go_to_previous_activity": {
      if (!(state.selectedLesson?.activities && state.selectedActivity))
        return state;
      const previousActivity =
        state.selectedLesson.activities[
          state.selectedLesson.activities.indexOf(state.selectedActivity) - 1
        ];
      return { ...state, selectedActivity: previousActivity };
    }

    case "go_to_next_activity": {
      if (!(state.selectedLesson?.activities && state.selectedActivity))
        return state;
      const nextActivity =
        state.selectedLesson.activities[
          state.selectedLesson.activities.indexOf(state.selectedActivity) + 1
        ];
      return { ...state, selectedActivity: nextActivity };
    }

    case "reorder_activity": {
      if (!state.selectedLesson?.activities) return state;

      const activities = Array.from(state.selectedLesson.activities);
      const [removed] = activities.splice(action.fromId, 1);
      activities.splice(action.toId, 0, removed);

      return {
        ...state,
        selectedLesson: {
          ...state.selectedLesson,
          activities,
        },
      };
    }

    // --- Miscellaneous ---
    case "select_mode": {
      // Selectionner un mode pour l'editeur de texte. Si le mode
      // est "write", alors déselectionner l'activité actuelle et
      // nettoyer le contenu de l'editeur de texte.
      const selectedActivity =
        action.mode === "write" ? undefined : state.selectedActivity;
      const textActivityContent =
        action.mode === "write" ? undefined : state.textActivityContent;

      const activityType =
        action.mode === "write" ? action.activityType : undefined;

      return {
        ...state,
        mode: action.mode,
        selectedActivity,
        textActivityContent,
        activityType,
        newActivityTitle: undefined,
      };
    }

    case "toggle_panel_visibility":
      localStorage.setItem(STORAGE_KEY, JSON.stringify(!state.isPanelClosed));
      return { ...state, isPanelClosed: !state.isPanelClosed };

    case "set_modal_visibility":
      return { ...state, modalVisibility: action.modalVisibility };

    default:
      return state;
  }
}
