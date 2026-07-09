import { useEffect, useReducer, useState } from "react";
import { lessonApi } from "../api/lesson.api";
import useInput from "../../../hooks/useInput";
import { useLocation } from "react-router";

import { regexGeneric, regexOptionalGeneric } from "../../../config/constantes";
import Tag from "../../../../src/utils/interfaces/tag";
import Lesson from "../../../../src/utils/interfaces/lesson";

import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export type Item = {
  id: number;
  title: string;
};

export type CourseItem = Item & {
  tags: Tag[];
};

type State = {
  parcoursList: Item[];
  parcoursId: number | null;
  modulesList: Item[];
  moduleId: number | null;
  courseList: CourseItem[];
  courseId: number | null;
  tags: Tag[] | null;
  mode: string;
  nextClicked: boolean;
  tag: Tag | null;
  isLoading: boolean;
};

type Action =
  | { type: "SET_PARCOURS_LIST"; payload: Item[] }
  | { type: "SET_PARCOURS_ID"; payload: number | null }
  | { type: "SET_MODULES_LIST"; payload: Item[] }
  | { type: "SET_MODULE_ID"; payload: number | null }
  | { type: "SET_COURSE_LIST"; payload: CourseItem[] }
  | { type: "SET_COURSE_ID"; payload: number | null }
  | { type: "SET_TAGS"; payload: Tag[] | null }
  | { type: "SET_MODE"; payload: string }
  | { type: "SET_NEXT_CLICKED"; payload: boolean }
  | { type: "SET_TAG"; payload: Tag | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_FORM" };

const initialState: State = {
  parcoursList: [],
  parcoursId: null,
  modulesList: [],
  moduleId: null,
  courseList: [],
  courseId: null,
  tags: null,
  mode: "hybride",
  nextClicked: false,
  tag: null,
  isLoading: false,
};

const lessonReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PARCOURS_LIST":
      return { ...state, parcoursList: action.payload };
    case "SET_PARCOURS_ID":
      return {
        ...state,
        parcoursId: action.payload,
        moduleId: null,
        courseId: null,
        courseList: [],
      };
    case "SET_MODULES_LIST":
      return { ...state, modulesList: action.payload };
    case "SET_MODULE_ID":
      return {
        ...state,
        moduleId: action.payload,
        courseId: null,
        courseList: [],
      };
    case "SET_COURSE_LIST":
      return { ...state, courseList: action.payload };
    case "SET_COURSE_ID":
      return { ...state, courseId: action.payload };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_NEXT_CLICKED":
      return { ...state, nextClicked: action.payload };
    case "SET_TAG":
      return { ...state, tag: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        tag: null,
        mode: "hybride",
      };
    default:
      return state;
  }
};

const useAddLesson = () => {
  const [state, dispatch] = useReducer(lessonReducer, initialState);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const { value: title, newProps: newTitle } = useInput((value) =>
    regexGeneric.test(value)
  );
  const { value: description, newProps: newDescription } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );

  useEffect(() => {
    if (location.state) {
      const { parcoursId, moduleId, courseId } = location.state;
      lessonApi.queries.getCoursesByModule(moduleId).then((data) => {
        dispatch({ type: "SET_COURSE_LIST", payload: data });
        const course = data.find((item) => item.id === courseId);
        if (course) {
          dispatch({ type: "SET_TAGS", payload: course.tags });
        }
        dispatch({ type: "SET_PARCOURS_ID", payload: parcoursId });
        dispatch({ type: "SET_MODULE_ID", payload: moduleId });
        dispatch({ type: "SET_COURSE_ID", payload: courseId });
        handleStep(true);
      });
    }
  }, [location.state]);

  const handleSubmitLesson = () => {
    dispatch({ type: "SET_LOADING", payload: true });
    lessonApi.mutations
      .createLesson(state.courseId!, {
        tagId: state.tag?.id,
        title: title.value,
        description: description.value,
        modalite: state.mode,
      })
      .then((data: Lesson) => {
        toast.success(`La leçon ${data.title} a été créée avec succès`);
        dispatch({ type: "SET_LOADING", payload: false });
        navigate(
          location.state ? `/admin/parcours/module/${state.moduleId}` : "..",
          { state: { lessonId: data.id } }
        );
      })
      .catch((err: any) => {
        dispatch({ type: "SET_LOADING", payload: false });
        setError(
          err.response?.data?.message ||
            err.message ||
            "Une erreur est survenue"
        );
      });
  };

  const getItem = <T extends { id: number | null }>(
    id: number | null,
    list: T[]
  ): T | undefined => {
    if (id) {
      const item = list.find((element: T) => element.id === id);
      return item;
    }
    return undefined;
  };

  const handleResetForm = () => {
    title.reset();
    description.reset();
    newTitle("");
    newDescription("");
    dispatch({ type: "RESET_FORM" });
  };

  const handleStep = (value: boolean) => {
    dispatch({ type: "SET_NEXT_CLICKED", payload: value });
  };

  useEffect(() => {
    lessonApi.queries.getParcoursSelect().then((data) => {
      dispatch({ type: "SET_PARCOURS_LIST", payload: data });
    });
  }, []);

  useEffect(() => {
    if (state.parcoursId) {
      lessonApi.queries
        .getModulesByParcours(state.parcoursId)
        .then((data) => {
          dispatch({ type: "SET_MODULES_LIST", payload: data });
        });
    }
  }, [state.parcoursId]);

  useEffect(() => {
    if (state.moduleId) {
      lessonApi.queries.getCoursesByModule(state.moduleId).then((data) => {
        dispatch({ type: "SET_COURSE_LIST", payload: data });
      });
    } else {
      dispatch({ type: "SET_COURSE_LIST", payload: [] });
      dispatch({ type: "SET_COURSE_ID", payload: null });
    }
  }, [state.moduleId]);

  useEffect(() => {
    if (state.courseId) {
      const course = state.courseList.find(
        (item) => item.id === state.courseId
      );
      if (course) dispatch({ type: "SET_TAGS", payload: course.tags });
    }
  }, [state.courseId, state.courseList]);

  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [error]);

  return {
    parcoursList: state.parcoursList,
    description,
    title,
    tag: state.tag,
    tags: state.tags,
    setTag: (tag: Tag | null) => dispatch({ type: "SET_TAG", payload: tag }),
    mode: state.mode,
    setMode: (mode: string) => dispatch({ type: "SET_MODE", payload: mode }),
    parcoursId: state.parcoursId,
    modulesList: state.modulesList,
    moduleId: state.moduleId,
    courseList: state.courseList,
    courseId: state.courseId,
    isLoading: state.isLoading,
    setParcoursId: (parcoursId: number | null) =>
      dispatch({ type: "SET_PARCOURS_ID", payload: parcoursId }),
    setModuleId: (moduleId: number | null) =>
      dispatch({ type: "SET_MODULE_ID", payload: moduleId }),
    setCourseId: (courseId: number | null) =>
      dispatch({ type: "SET_COURSE_ID", payload: courseId }),
    handleSubmitLesson,
    getItem,
    handleResetForm,
    nextClicked: state.nextClicked,
    handleStep,
  };
};

export default useAddLesson;
