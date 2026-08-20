import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import Course from "../../../utils/interfaces/course";
import CourseDates from "../interfaces/course-dates";
import Lesson from "../../../utils/interfaces/lesson";
import Objective from "../../../utils/interfaces/objective";
import Skill from "../../../utils/interfaces/skill";
import Tag from "../../../utils/interfaces/tag";
import Contact from "../../../utils/interfaces/contact";
import { sortArray } from "../../../utils/helpers/sort-array";

export type CourseState = {
  course: Course | null;
  courseDates: CourseDates[] | null;
  currentDates: CourseDates | null;
  scenario: boolean;
  courseLessons: Lesson[] | null;
  submit: boolean;
  parcoursObjectives: Objective[] | null;
  courseObjectives: Objective[] | null;
  moduleSkills: Skill[] | null;
  courseSkills: Skill[] | null;
};

const INITIAL_STATE: CourseState = {
  course: null,
  courseDates: null,
  currentDates: null,
  scenario: true,
  courseLessons: [],
  submit: false,
  parcoursObjectives: null,
  courseObjectives: null,
  moduleSkills: null,
  courseSkills: null,
};

type Action =
  | { type: "SET_COURSE"; payload: Course | null }
  | { type: "SET_COURSE_INFOS"; payload: { title: string; description: string; visibility: boolean } }
  | { type: "SET_COURSE_TAGS"; payload: Tag[] }
  | { type: "SET_COURSE_CONTACTS"; payload: Contact[] }
  | { type: "SET_COURSE_VIRTUAL_CLASS"; payload: string }
  | { type: "RESET_COURSE" }
  | { type: "SET_COURSE_DATES"; payload: CourseDates[] | null }
  | { type: "SET_CURRENT_DATES"; payload: CourseDates }
  | { type: "DELETE_COURSE_DATES"; payload: number }
  | { type: "RESET_DATES" }
  | { type: "INIT_COURSE_DATA"; payload: { scenario: boolean; lessons: Lesson[] } }
  | { type: "SET_SCENARIO"; payload: boolean }
  | { type: "NEW_LESSON"; payload: Lesson }
  | { type: "DELETE_LESSON"; payload: number | undefined }
  | { type: "REORDER_LESSONS"; payload: Lesson[] }
  | { type: "UPDATE_LESSON"; payload: Lesson }
  | { type: "ADD_MANY_LESSONS"; payload: Lesson[] }
  | { type: "RESET_COURSE_SCENARIO" }
  | { type: "RESET_SUBMIT" }
  | { type: "INIT_OBJECTIVES_DATA"; payload: { courseObjectives: Objective[] | null; parcoursObjectives: Objective[] | null } }
  | { type: "SET_COURSE_OBJECTIVES"; payload: Objective[] | null }
  | { type: "UPDATE_COURSES_OBJECTIVES"; payload: Objective }
  | { type: "RESET_COURSE_OBJECTIVES" }
  | { type: "INIT_SKILLS_DATA"; payload: { courseSkills: Skill[] | null; moduleSkills: Skill[] | null } }
  | { type: "SET_COURSE_SKILLS"; payload: Skill[] | null }
  | { type: "RESET_COURSE_SKILLS" }
  | { type: "RESET_ALL" };

function courseReducer(state: CourseState, action: Action): CourseState {
  switch (action.type) {
    case "SET_COURSE":
      return { ...state, course: action.payload };
    case "SET_COURSE_INFOS":
      if (!state.course) return state;
      return {
        ...state,
        course: {
          ...state.course,
          title: action.payload.title,
          description: action.payload.description,
          visibility: action.payload.visibility,
        },
      };
    case "SET_COURSE_TAGS":
      if (!state.course) return state;
      return { ...state, course: { ...state.course, tags: action.payload } };
    case "SET_COURSE_CONTACTS":
      if (!state.course) return state;
      return { ...state, course: { ...state.course, contacts: action.payload } };
    case "SET_COURSE_VIRTUAL_CLASS":
      if (!state.course) return state;
      return { ...state, course: { ...state.course, virtualClass: action.payload } };
    case "RESET_COURSE":
      return { ...state, course: null };
    case "SET_COURSE_DATES":
      return { ...state, courseDates: action.payload };
    case "SET_CURRENT_DATES":
      return { ...state, currentDates: action.payload };
    case "DELETE_COURSE_DATES":
      if (!state.courseDates) return state;
      return {
        ...state,
        courseDates: state.courseDates.filter((d) => d.id !== action.payload),
      };
    case "RESET_DATES":
      return { ...state, courseDates: null, currentDates: null };
    case "INIT_COURSE_DATA":
      return {
        ...state,
        scenario: action.payload.scenario,
        courseLessons: action.payload.lessons,
      };
    case "SET_SCENARIO":
      return { ...state, scenario: action.payload };
    case "NEW_LESSON":
      return {
        ...state,
        courseLessons: state.courseLessons
          ? sortArray([...state.courseLessons, action.payload], "order")
          : [action.payload],
      };
    case "DELETE_LESSON":
      return {
        ...state,
        courseLessons: state.courseLessons?.filter(
          (l) => l.id !== action.payload,
        ) ?? null,
      };
    case "REORDER_LESSONS": {
      let i = -1;
      const lessons = action.payload.map((item: Lesson) => {
        i += 1;
        return { ...item, order: i };
      });
      return { ...state, courseLessons: lessons, submit: true };
    }
    case "UPDATE_LESSON":
      if (!state.courseLessons) return state;
      return {
        ...state,
        courseLessons: state.courseLessons.map((l) =>
          l.id === action.payload.id ? action.payload : l,
        ),
      };
    case "ADD_MANY_LESSONS": {
      const existing = state.courseLessons ?? [];
      const merged = [...existing];
      for (const lesson of action.payload) {
        if (!merged.find((l) => l.id === lesson.id)) {
          merged.push(lesson);
        }
      }
      return {
        ...state,
        courseLessons: merged.map((item, i) => ({ ...item, order: i })),
      };
    }
    case "RESET_COURSE_SCENARIO":
      return { ...state, scenario: true, courseLessons: null };
    case "RESET_SUBMIT":
      return { ...state, submit: false };
    case "INIT_OBJECTIVES_DATA":
      return {
        ...state,
        courseObjectives: action.payload.courseObjectives,
        parcoursObjectives: action.payload.parcoursObjectives,
      };
    case "SET_COURSE_OBJECTIVES":
      return { ...state, courseObjectives: action.payload };
    case "UPDATE_COURSES_OBJECTIVES":
      if (!state.courseObjectives || !state.parcoursObjectives) return state;
      return {
        ...state,
        parcoursObjectives: [...state.parcoursObjectives, action.payload],
        courseObjectives: [...state.courseObjectives, action.payload],
      };
    case "RESET_COURSE_OBJECTIVES":
      return { ...state, parcoursObjectives: null, courseObjectives: null };
    case "INIT_SKILLS_DATA":
      return {
        ...state,
        courseSkills: action.payload.courseSkills,
        moduleSkills: action.payload.moduleSkills,
      };
    case "SET_COURSE_SKILLS":
      return { ...state, courseSkills: action.payload };
    case "RESET_COURSE_SKILLS":
      return { ...state, courseSkills: null, moduleSkills: null };
    case "RESET_ALL":
      return INITIAL_STATE;
    default:
      return state;
  }
}

type CourseContextValue = {
  state: CourseState;
  dispatch: React.Dispatch<Action>;
};

const CourseContext = createContext<CourseContextValue | null>(null);

type CourseProviderProps = {
  children: ReactNode;
};

export function CourseProvider({ children }: CourseProviderProps) {
  const [state, dispatch] = useReducer(courseReducer, INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    return () => {
      dispatch({ type: "RESET_ALL" });
    };
  }, []);

  return (
    <CourseContext.Provider value={{ state, dispatch }}>
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseContext(): CourseContextValue {
  const ctx = useContext(CourseContext);
  if (!ctx) {
    throw new Error("useCourseContext must be used within a CourseProvider");
  }
  return ctx;
}

export function useCourseSelector<T>(
  selector: (state: CourseState) => T,
): T {
  const { state } = useCourseContext();
  return selector(state);
}

export function useCourseDispatch(): React.Dispatch<Action> {
  const { dispatch } = useCourseContext();
  return dispatch;
}
