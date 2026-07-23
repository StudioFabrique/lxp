import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Contact from "../../../../utils/interfaces/contact";
import Skill from "../../../../utils/interfaces/skill";
import { moduleCreateSchema } from "../../../../features/parcours/parcours.schema";
import apiClient from "../../../../lib/axios";
import toast from "react-hot-toast";


/**
 * Represents a selectable item (formation or parcours)
 */
export type Item = {
  id: number;
  title: string;
};

/**
 * Represents a newly created module
 */
/**
 * State shape for the module creation form
 */
type State = {
  /** File selected for module image upload */
  file: File | null;
  /** Currently selected parcours ID */
  parcoursId: number | null;
  /** Currently selected formation ID */
  formationId: number | null;
  /** Current operation mode (create or edit) */
  mode: "create" | "edit";
  /** List of available formations */
  formationList: Item[];
  /** List of parcours for the selected formation */
  parcoursList: Item[];
  /** Contacts selected for the current module metadata */
  currentContacts: Contact[];
  /** Skills selected for the current module metadata */
  currentSkills: Skill[];
  /** All available contacts for the selected parcours */
  contacts: Contact[] | null;
  /** All available skills for the selected parcours */
  skills: Skill[] | null;
  /** Base64 encoded image string for preview */
  image: string | undefined;
  /** Toggle to show/hide confirmation modal */
  showModal: boolean;
};

/**
 * Action types for the module creation reducer
 */
type Action =
  /** Set the list of available formations */
  | { type: "SET_FORMATION_LIST"; payload: Item[] }
  /** Set the list of parcours for selected formation */
  | { type: "SET_PARCOURS_LIST"; payload: Item[] }
  /** Set the currently selected parcours ID */
  | { type: "SET_PARCOURS_ID"; payload: number | null }
  /** Set the currently selected formation ID */
  | { type: "SET_FORMATION_ID"; payload: number | null }
  /** Set the operation mode (create or edit) */
  | { type: "SET_MODE"; payload: "create" | "edit" }
  /** Set the uploaded file */
  | { type: "SET_FILE"; payload: File | null }
  /** Set both contacts and skills for the selected parcours */
  | {
      type: "SET_SKILLS_AND_CONTACTS";
      payload: { contacts: Contact[]; skills: Skill[] };
    }
  /** Set the currently selected contacts */
  | { type: "SET_CURRENT_CONTACTS"; payload: Contact[] }
  /** Set the currently selected skills */
  | { type: "SET_CURRENT_SKILLS"; payload: Skill[] }
  /** Set the base64 encoded image for preview */
  | { type: "SET_IMAGE_BASE64"; payload: string | undefined }
  /** Toggle the confirmation modal visibility */
  | { type: "TOGGLE_MODAL" };

/**
 * Initial state for the module creation form
 */
const initialState: State = {
  parcoursId: null,
  formationId: null,
  mode: "create",
  formationList: [],
  parcoursList: [],
  file: null,
  currentContacts: [],
  currentSkills: [],
  contacts: null,
  skills: null,
  image: undefined,
  showModal: false,
};

/**
 * Reducer for managing module creation form state
 * Handles all state mutations based on dispatched actions
 *
 * @param state Current state object
 * @param action Action to process
 * @returns Updated state
 */
const newModuleReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FORMATION_LIST":
      return { ...state, formationList: action.payload };

    case "SET_PARCOURS_LIST":
      return { ...state, parcoursList: action.payload };

    case "SET_PARCOURS_ID":
      return { ...state, parcoursId: action.payload };

    case "SET_FORMATION_ID":
      return {
        ...state,
        formationId: action.payload,
        parcoursId: null,
        parcoursList: [],
        contacts: null,
        skills: null,
        currentContacts: [],
        currentSkills: [],
      };

    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SET_FILE":
      return { ...state, file: action.payload };

    case "SET_SKILLS_AND_CONTACTS":
      return {
        ...state,
        contacts: action.payload.contacts,
        skills: action.payload.skills,
      };

    case "SET_CURRENT_CONTACTS":
      return { ...state, currentContacts: action.payload };

    case "SET_CURRENT_SKILLS":
      return { ...state, currentSkills: action.payload };

    case "SET_IMAGE_BASE64":
      return { ...state, image: action.payload };

    case "TOGGLE_MODAL":
      return { ...state, showModal: !state.showModal };

    default:
      return state;
  }
};

/**
 * Custom hook for managing module creation workflow
 *
 * This hook handles:
 * - Formation and parcours selection
 * - Module data creation
 * - Metadata association (contacts, skills, duration)
 * - Image upload and preview
 * - Form validation and submission
 *
 * @returns Object containing state and handlers for module creation
 */
const useNewModule = () => {
  const nav = useNavigate();
  const [state, dispatch] = useReducer(newModuleReducer, initialState);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    formState: { errors },
    getValues,
    trigger,
    watch,
  } = useForm({
    resolver: zodResolver(moduleCreateSchema),
  });

  /**
   * Fetch the list of available formations from the API
   */
  const handleGetFormation = useCallback(() => {
    const processData = (formationData: Array<Item>) => {
      dispatch({ type: "SET_FORMATION_LIST", payload: formationData });
    };
    setIsLoading(true);
    apiClient
      .get("/formation")
      .then((res) => processData(res.data as Array<Item>))
      .catch(
        (err) => setError(err?.response?.data?.message ?? "Erreur inconnue"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Handle formation selection
   * @param id Formation ID to select
   */
  const handlePickFormation = useCallback((id: number) => {
    dispatch({ type: "SET_FORMATION_ID", payload: id });
    setIsLoading(true);
    apiClient
      .get(`/parcours/select/${id}`)
      .then((res) =>
        dispatch({
          type: "SET_PARCOURS_LIST",
          payload: res.data as Item[],
        }),
      )
      .catch((err) =>
        setError(err?.response?.data?.message ?? "Erreur inconnue"),
      )
      .finally(() => setIsLoading(false));
  }, []);

  /**
   * Submit the module creation form
   * Validates input, creates FormData with module info and image, and sends to API
   *
   * @param e Form submission event
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate formation selection
      if (!state.formationId) {
        toast.error("Veuillez sélectionner une formation.");
        return;
      }
      if (!state.parcoursId) {
        toast.error("Veuillez sélectionner un parcours.");
        return;
      }

      // Validate form fields
      const isValid = await trigger();
      if (!isValid) return;

      // Prepare FormData for multipart upload (module metadata + image)
      const formData = new FormData();
      const module = {
        ...getValues(),
        formationId: state.formationId,
        parcoursId: state.parcoursId,
        contacts: state.currentContacts
          .map((contact) => contact.id)
          .filter((id): id is number => typeof id === "number"),
        skills: state.currentSkills
          .map((skill) => skill.id)
          .filter((id): id is number => typeof id === "number"),
      };

      formData.append("module", JSON.stringify(module));
      if (state.file) formData.append("image", state.file);

      // Handler for successful module creation
      setIsLoading(true);
      apiClient
        .post("/formation/new-module", formData)
        .then((res) => {
          const result = res.data as { message: string };
          toast.success(result.message);
          nav("/admin/module");
        })
        .catch(
          (err) => setError(err?.response?.data?.message ?? "Erreur inconnue"),
        )
        .finally(() => setIsLoading(false));
    },
    [
      state.formationId,
      state.parcoursId,
      state.currentContacts,
      state.currentSkills,
      state.file,
      getValues,
      trigger,
      nav,
    ],
  );

  /**
   * Handle file selection and store in state
   * @param file File selected by user (or null to clear)
   */
  const handleSetFile = useCallback((file: File | null) => {
    dispatch({ type: "SET_FILE", payload: file });
  }, []);

  /**
   * Handle parcours selection and fetch related contacts and skills
   * @param id Parcours ID to select
   */
  const handlePickParcours = useCallback(
    (id: number) => {
      dispatch({ type: "SET_PARCOURS_ID", payload: id });

      // Fetch contacts and skills for the selected parcours
      setIsLoading(true);
      apiClient
        .get(`/parcours/skills-contacts/${id}`)
        .then((res) => {
          const result = res.data as {
            contacts: Contact[];
            skills: Skill[];
          };
          dispatch({
            type: "SET_SKILLS_AND_CONTACTS",
            payload: { contacts: result.contacts, skills: result.skills },
          });
        })
        .catch(
          (err) => setError(err?.response?.data?.message ?? "Erreur inconnue"),
        )
        .finally(() => setIsLoading(false));
    },
    [],
  );

  /**
   * Update the selected contacts list
   * @param contacts Array of contacts to select
   */
  const setCurrentContacts = useCallback((contacts: Contact[]) => {
    dispatch({ type: "SET_CURRENT_CONTACTS", payload: contacts });
  }, []);

  /**
   * Update the selected skills list
   * @param skills Array of skills to select
   */
  const setCurrentSkills = useCallback((skills: Skill[]) => {
    dispatch({ type: "SET_CURRENT_SKILLS", payload: skills });
  }, []);

  /**
   * Navigate back to the module list page
   */
  const handleBackToModuleList = useCallback(() => {
    nav("/admin/module");
  }, [nav]);

  /**
   * Set the base64 encoded image string for preview
   * @param base64 Base64 string or null to clear
   */
  const setImageBase64 = useCallback((base64: string | null) => {
    dispatch({ type: "SET_IMAGE_BASE64", payload: base64 ?? undefined });
  }, []);

  /**
   * Toggle the confirmation modal visibility
   * Uses DaisyUI modal API to show/hide the dialog element
   */
  const toggleModal = useCallback(() => {
    dispatch({ type: "TOGGLE_MODAL" });
  }, []);

  /**
   * Initialize: Fetch formations on component mount
   */
  useEffect(() => {
    handleGetFormation();
  }, [handleGetFormation]);

  /**
   * Handle and display HTTP errors
   */
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  // Return all state and handlers for consumption by components
  return {
    ...state,
    isLoading,
    register,
    errors,
    watch,
    handleSubmit,
    handlePickFormation,
    handleSetFile,
    handlePickParcours,
    setCurrentContacts,
    setCurrentSkills,
    handleBackToModuleList,
    setImageBase64,
    toggleModal,
    showModal: state.showModal,
  };
};

export default useNewModule;
