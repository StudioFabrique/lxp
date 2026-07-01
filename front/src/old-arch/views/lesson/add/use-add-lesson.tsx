// Imports des hooks React et des hooks personnalisés
import { useEffect, useReducer } from "react";
import useHttp from "../../../hooks/use-http";
import useInput from "../../../hooks/use-input";
import { useLocation } from "react-router";

// Imports des constantes et interfaces
import { regexGeneric, regexOptionalGeneric } from "../../../utils/constantes";
import Tag from "../../../utils/interfaces/tag";
import Lesson from "../../../utils/interfaces/lesson";

// Imports des dépendances externes
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

// Types pour les listes de données
export type Item = {
  id: number;
  title: string;
};

// Type étendu pour les cours qui contiennent des tags
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
        moduleId: null, // Reset dépendant
        courseId: null, // Reset dépendant
        courseList: [], // Reset dépendant
      };
    case "SET_MODULES_LIST":
      return { ...state, modulesList: action.payload };
    case "SET_MODULE_ID":
      return {
        ...state,
        moduleId: action.payload,
        courseId: null, // Reset dépendant
        courseList: [], // Reset dépendant
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

/**
 * Hook personnalisé pour gérer l'ajout d'une nouvelle leçon
 * Gère les états et la logique pour le formulaire d'ajout de leçon
 * @returns Un objet contenant les états et fonctions nécessaires pour le formulaire
 */
const useAddLesson = () => {
  const [state, dispatch] = useReducer(lessonReducer, initialState);
  const { error, sendRequest } = useHttp();
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
      const applyData = (data: CourseItem[]) => {
        dispatch({ type: "SET_COURSE_LIST", payload: data });
        const course = data.find((item) => item.id === courseId);
        if (course) {
          dispatch({ type: "SET_TAGS", payload: course.tags });
        }
        dispatch({ type: "SET_PARCOURS_ID", payload: parcoursId });
        dispatch({ type: "SET_MODULE_ID", payload: moduleId });
        dispatch({ type: "SET_COURSE_ID", payload: courseId });
        handleStep(true);
      };

      sendRequest({ path: `/course/select/${moduleId}` }, applyData);
    }
  }, [location.state, sendRequest]);

  /**
   * Gère la soumission du formulaire pour créer une nouvelle leçon
   * Envoie une requête au serveur et gère la réponse
   */
  const handleSubmitLesson = () => {
    // Callback appelé après une réponse réussie du serveur
    const applyData = (data: Lesson) => {
      toast.success(`La leçon ${data.title} a été créée avec succès`);
      dispatch({ type: "SET_LOADING", payload: false });
      navigate(
        location.state ? `/admin/parcours/module/${state.moduleId}` : "..",
        { state: { lessonId: data.id } }
      );
    };

    // Envoi de la requête
    dispatch({ type: "SET_LOADING", payload: true });
    sendRequest(
      {
        path: `/course/new-lesson/${state.courseId}`,
        method: "put",
        body: {
          tagId: state.tag?.id,
          title: title.value,
          description: description.value,
          modalite: state.mode,
        },
      },
      applyData
    );
  };

  /**
   * Fonction utilitaire pour trouver un élément dans une liste par son ID
   * @param id - L'ID de l'élément à trouver
   * @param list - La liste dans laquelle chercher
   * @returns L'élément trouvé ou undefined
   */
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

  /**
   * Réinitialise tous les champs du formulaire à leurs valeurs par défaut
   */
  const handleResetForm = () => {
    title.reset();
    description.reset();
    newTitle("");
    newDescription("");
    dispatch({ type: "RESET_FORM" });
  };

  /**
   * Gère le changement d'étape dans le formulaire d'ajout de leçon
   * @param value - true pour passer à l'étape suivante, false pour revenir à l'étape précédente
   */
  const handleStep = (value: boolean) => {
    dispatch({ type: "SET_NEXT_CLICKED", payload: value });
  };

  // Effet pour charger la liste des parcours au montage du composant
  useEffect(() => {
    sendRequest({ path: "/parcours/select" }, (data: Item[]) => {
      dispatch({ type: "SET_PARCOURS_LIST", payload: data });
    });
  }, [sendRequest]);

  // Effet pour mettre à jour la liste des modules quand un parcours est sélectionné
  useEffect(() => {
    if (state.parcoursId) {
      sendRequest(
        { path: `/modules/parcours-modules/${state.parcoursId}` },
        (data: Item[]) => {
          console.log({ data });

          dispatch({ type: "SET_MODULES_LIST", payload: data });
        }
      );
    }
  }, [state.parcoursId, sendRequest]);

  // Effet pour mettre à jour la liste des cours quand un module est sélectionné
  useEffect(() => {
    if (state.moduleId) {
      sendRequest(
        { path: `/course/select/${state.moduleId}` },
        (data: CourseItem[]) => {
          dispatch({ type: "SET_COURSE_LIST", payload: data });
        }
      );
    } else {
      // Reset des cours si aucun module n'est sélectionné
      dispatch({ type: "SET_COURSE_LIST", payload: [] });
      dispatch({ type: "SET_COURSE_ID", payload: null });
    }
  }, [state.moduleId, sendRequest]);

  // Effet pour mettre à jour les tags disponibles quand un cours est sélectionné
  useEffect(() => {
    if (state.courseId) {
      const course = state.courseList.find(
        (item) => item.id === state.courseId
      );
      if (course) dispatch({ type: "SET_TAGS", payload: course.tags });
    }
  }, [state.courseId, state.courseList]);

  // Effet pour gérer les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [error]);

  // Retourne tous les états et fonctions nécessaires pour le composant
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
