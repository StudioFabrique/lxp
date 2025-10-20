import { Activity } from "../../../utils/interfaces/activity";
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";
import LessonRating from "../../../utils/interfaces/lesson-rating";

// Identifiant de clé pour stocker la valeur permettant de savoir si le panneau latéral a été fermé par l'utilisateur
const STORAGE_KEY = "lessons-preview-panel-closed";

type ModalVisibility = "deletionModal" | "lessonCompletionModal" | "none";

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
      mode: "edit";
      // rajouter les propriétés supplémentaires pour le mode "edit"
      titleError?: string;
    }
  | {
      mode: "write";
      // rajouter les propriétés supplémentaires pour le mode "write"
      newActivityTitle?: string;
      titleError?: string;
    };

// Le type du state du reducer
type LessonsPreviewState = StaticStateProperties & ConditionnalStateProperties;

type LessonsPreviewAction =
  // Module
  | { type: "update_module_data"; module: Module & { parcours: string } }
  // Course
  | { type: "set_course_visibility"; isVisible: boolean; course: Course }
  // Lesson
  | { type: "select_lesson"; lesson?: Lesson }
  | { type: "select_lesson_by_id"; id: number }
  | { type: "go_to_next_lesson" }
  | { type: "set_lesson_rating"; rating: LessonRating }
  | { type: "mark_lesson_as_read"; lesson: Lesson; lessonRead: LessonRead }
  // Activity
  | { type: "select_activity"; activity?: Activity }
  | { type: "select_last_activity_from_current_lesson" }
  | { type: "create_activity"; activity?: Activity }
  | { type: "edit_activity"; activity?: Activity }
  | { type: "delete_selected_activity" }
  | { type: "update_activity_title"; title: string }
  | { type: "set_activity_title_error"; error?: string }
  | { type: "update_activity_content"; content: string }
  // Miscellaneous
  | { type: "select_mode"; mode: "read" | "edit" | "write" }
  | { type: "toggle_panel_visibility" }
  | { type: "set_modal_visibility"; modalVisibility: ModalVisibility };

const stored = localStorage.getItem(STORAGE_KEY);

export const initialLessonsPreviewState: LessonsPreviewState = {
  mode: "read",
  isPanelClosed: stored ? JSON.parse(stored) : false,
  modalVisibility: "none",
};

export function lessonsPreviewReducer(
  state: LessonsPreviewState,
  action: LessonsPreviewAction
): LessonsPreviewState {
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
          : course
      );

      return {
        ...state,
        module: {
          ...state.module,
          courses,
        },
      };
    }

    // --- Lesson ---
    case "select_lesson": {
      // Selectionne la leçon dont les détails ont été chargés, et selectionne la première activité de la leçon (si existante).
      // Le mode est basculé sur "read" automatiquement.
      const selectedActivity =
        action.lesson?.activities?.[0] && action.lesson?.activities[0];

      return {
        ...state,
        mode: "read",
        selectedLesson:
          action.lesson && state.selectedLesson
            ? { ...state.selectedLesson, ...action.lesson }
            : action.lesson,
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

    case "go_to_next_lesson": {
      const { selectedLesson, module } = state;

      if (!(selectedLesson && selectedLesson.id && module)) return state;

      const allLessons = module.courses.flatMap((course) => course.lessons);
      const currentLessonIndex = allLessons.findIndex(
        (lesson) => lesson.id === selectedLesson.id
      );
      const nextLesson = allLessons[currentLessonIndex + 1];

      return {
        ...state,
        selectedLesson: nextLesson,
        mode: "read",
        modalVisibility: "none",
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

    case "mark_lesson_as_read": {
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
        activity.id === action.activity?.id ? action.activity : activity
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
        (activity) => state.selectedActivity?.id !== activity.id
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
      if (state.mode === "read") return state;
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
      if (state.mode === "read") return state;
      return { ...state, titleError: action.error };

    case "update_activity_content":
      return { ...state, textActivityContent: action.content };

    // --- Miscellaneous ---
    case "select_mode": {
      // Selectionner un mode pour l'editeur de texte. Si le mode
      // est "write", alors déselectionner l'activité actuelle et
      // nettoyer le contenu de l'editeur de texte.
      const selectedActivity =
        action.mode === "write" ? undefined : state.selectedActivity;
      const textActivityContent =
        action.mode === "write" ? undefined : state.textActivityContent;

      return {
        ...state,
        mode: action.mode,
        selectedActivity,
        textActivityContent,
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
