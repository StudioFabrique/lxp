import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import Lesson from "../../../utils/interfaces/lesson";
import { Activity } from "../../../utils/interfaces/activity";

export type LessonState = {
  lesson: Lesson | null;
  currentType: string;
  blogEdition: number | null;
  activityToDelete: Activity | null;
};

const INITIAL_STATE: LessonState = {
  lesson: null,
  currentType: "",
  blogEdition: null,
  activityToDelete: null,
};

type Action =
  | { type: "INIT_LESSON"; payload: Lesson | null }
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "SET_ACTIVITY_TO_DELETE"; payload: Activity | null }
  | { type: "SET_CURRENT_TYPE"; payload: string }
  | { type: "SET_BLOG_EDITION"; payload: number | null }
  | { type: "UPDATE_ACTIVITY"; payload: Activity }
  | { type: "REMOVE_ACTIVITY"; payload: number | string | undefined }
  | { type: "SET_ACTIVITY"; payload: Activity[] }
  | { type: "RESET_CURRENT_TYPE" }
  | { type: "RESET_LESSON" }
  | { type: "RESET_ALL" };

function lessonReducer(state: LessonState, action: Action): LessonState {
  switch (action.type) {
    case "INIT_LESSON":
      return { ...state, lesson: action.payload };
    case "ADD_ACTIVITY":
      if (!state.lesson) return state;
      return {
        ...state,
        lesson: {
          ...state.lesson,
          activities: [...(state.lesson.activities ?? []), action.payload],
        },
      };
    case "SET_ACTIVITY_TO_DELETE":
      return { ...state, activityToDelete: action.payload };
    case "SET_CURRENT_TYPE":
      return { ...state, currentType: action.payload };
    case "SET_BLOG_EDITION":
      return { ...state, blogEdition: action.payload };
    case "UPDATE_ACTIVITY": {
      if (!state.lesson?.activities) return state;
      const updated = state.lesson.activities.filter(
        (a) => a.id !== action.payload.id,
      );
      return {
        ...state,
        lesson: {
          ...state.lesson,
          activities: [...updated, action.payload],
        },
      };
    }
    case "REMOVE_ACTIVITY": {
      if (!state.lesson?.activities) return state;
      const remaining = state.lesson.activities.filter(
        (a) => a.id !== action.payload,
      );
      return {
        ...state,
        lesson: {
          ...state.lesson,
          activities: remaining.map((a, i) => ({ ...a, order: i + 1 })),
        },
      };
    }
    case "SET_ACTIVITY":
      if (!state.lesson) return state;
      return { ...state, lesson: { ...state.lesson, activities: action.payload } };
    case "RESET_CURRENT_TYPE":
      return { ...state, currentType: "" };
    case "RESET_LESSON":
      return { ...state, lesson: null, currentType: "", blogEdition: null };
    case "RESET_ALL":
      return INITIAL_STATE;
    default:
      return state;
  }
}

type LessonContextValue = {
  state: LessonState;
  dispatch: React.Dispatch<Action>;
};

const LessonContext = createContext<LessonContextValue | null>(null);

type LessonProviderProps = {
  children: ReactNode;
};

export function LessonProvider({ children }: LessonProviderProps) {
  const [state, dispatch] = useReducer(lessonReducer, INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_ALL" });
    };
  }, []);

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  );
}

export function useLessonContext(): LessonContextValue {
  const ctx = useContext(LessonContext);
  if (!ctx) {
    throw new Error("useLessonContext must be used within a LessonProvider");
  }
  return ctx;
}

export function useLessonSelector<T>(
  selector: (state: LessonState) => T,
): T {
  const { state } = useLessonContext();
  return selector(state);
}

export function useLessonDispatch(): React.Dispatch<Action> {
  const { dispatch } = useLessonContext();
  return dispatch;
}
