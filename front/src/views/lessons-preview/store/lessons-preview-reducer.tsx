import { Activity } from "../../../utils/interfaces/activity";
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";
import LessonRead from "../../../utils/interfaces/lesson-read";

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
    }
  | {
      mode: "write";
      // rajouter les propriétés supplémentaires pour le mode "write"
    };

// Le type du state du reducer
type LessonsPreviewState = StaticStateProperties & ConditionnalStateProperties;

type LessonsPreviewAction =
  | { type: "select_mode"; mode: "read" | "edit" | "write" }
  | { type: "toggle_panel_visibility" }
  | { type: "set_modal_visibility"; modalVisibility: ModalVisibility }
  | { type: "update_module_data"; module: Module & { parcours: string } }
  | { type: "select_lesson"; lesson?: Lesson }
  | { type: "select_activity"; activity?: Activity }
  | { type: "delete_selected_activity" }
  | { type: "set_course_visibility"; isVisible: boolean; course: Course }
  | { type: "mark_lesson_as_read"; lesson: Lesson; lessonRead: LessonRead };

export const initialLessonsPreviewState: LessonsPreviewState = {
  mode: "read",
  isPanelClosed: JSON.parse(localStorage.getItem(STORAGE_KEY) || ""),
  modalVisibility: "none",
};

export function lessonsPreviewReducer(
  state: LessonsPreviewState,
  action: LessonsPreviewAction
): LessonsPreviewState {
  switch (action.type) {
    case "select_mode":
      return { ...state, mode: action.mode };
    case "toggle_panel_visibility":
      localStorage.setItem(STORAGE_KEY, JSON.stringify(!state.isPanelClosed));
      return { ...state, isPanelClosed: !state.isPanelClosed };

    case "set_modal_visibility":
      return { ...state, modalVisibility: action.modalVisibility };

    case "update_module_data":
      return { ...state, module: action.module };

    case "select_lesson":
      return { ...state, selectedLesson: action.lesson };

    case "select_activity":
      return { ...state, selectedActivity: action.activity };

    case "delete_selected_activity":
      if (!state.selectedActivity?.id || !state.selectedLesson) return state;
      return {
        ...state,
        selectedLesson: {
          ...state.selectedLesson,
          activities: state.selectedLesson?.activities?.filter(
            (activity) => state.selectedActivity?.id !== activity.id
          ),
        },
        selectedActivity: undefined,
      };

    case "set_course_visibility":
      // Pour le cours selectionné, définir la visibilité
      if (!state.module) return state;
      return {
        ...state,
        module: {
          ...state.module,
          courses: state.module.courses.map((course) =>
            course.id === action.course.id
              ? { ...course, visibility: action.isVisible }
              : course
          ),
        },
      };

    case "mark_lesson_as_read":
      if (!state.module || state.mode === "read") return state;
      return {
        ...state,
        module: {
          ...state.module,
          courses: state.module.courses.map((course) => ({
            ...course,
            lessons: course.lessons.map((lesson) => {
              if (lesson.id === action.lesson.id) {
                return {
                  ...lesson,
                  lessonsRead: [
                    ...(lesson.lessonsRead || []),
                    action.lessonRead,
                  ],
                };
              }
              return lesson;
            }),
          })),
        },
      };
    default:
      return state;
  }
}
