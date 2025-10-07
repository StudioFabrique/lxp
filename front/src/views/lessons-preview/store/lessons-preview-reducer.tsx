import { Activity } from "../../../utils/interfaces/activity";
import Module from "../../../utils/interfaces/module";
import Course from "../../../utils/interfaces/course";
import Lesson from "../../../utils/interfaces/lesson";

// Identifiant de clé pour stocker la valeur permettant de savoir si le panneau latéral a été fermé par l'utilisateur
const STORAGE_KEY = "lessons-preview-panel-closed";

// Propriétés qui sont disponibles à la modification et à la lecture sans conditions préalables
type StaticStateProperties = {
  isPanelClosed: boolean;
  module?: Module;
  selectedLesson?: Lesson;
  selectedActivity?: Activity;
  content?: string;
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
export type LessonsPreviewState = StaticStateProperties &
  ConditionnalStateProperties;

export type LessonsPreviewAction =
  | { type: "update_module_data"; newModule: Module }
  | { type: "select_lesson"; lesson: Lesson }
  | { type: "select_activity"; activity: Activity }
  | { type: "set_course_visibility"; isVisible: boolean; course: Course }
  | { type: "set_panel_close"; isClose: boolean };

export const initialLessonsPreviewState: LessonsPreviewState = {
  mode: "read",
  isPanelClosed: JSON.parse(localStorage.getItem(STORAGE_KEY) || ""),
};

export function lessonsPreviewReducer(
  state: LessonsPreviewState,
  action: LessonsPreviewAction
): LessonsPreviewState {
  switch (action.type) {
    case "set_panel_close":
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.isClose));
      return { ...state, isPanelClosed: action.isClose };

    case "update_module_data":
      return { ...state, module: action.newModule };

    case "select_lesson":
      return { ...state, selectedLesson: action.lesson };

    case "select_activity":
      return { ...state, selectedActivity: action.activity };

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
    default:
      return state;
  }
}
