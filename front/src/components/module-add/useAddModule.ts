import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Contact from "../../utils/interfaces/contact";
import Skill from "../../utils/interfaces/skill";
import { moduleCreateSchema } from "../../features/parcours/parcours.schema";
import apiClient from "../../lib/axios";
import toast from "react-hot-toast";

import SuccessWithMessage from "../../utils/interfaces/success-with-message";
import { ModuleData } from "../../utils/interfaces/new-module";

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
export type NewMddule = {
  id: number;
  title: string;
  description: string;
  quizInstructions: string;
  thumb: string | null;
};

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
  /** Module data after successful creation */
  newModuleData: NewMddule | null;
  /** Toggle to show/hide metadata form */
  showMetadataForm: boolean;
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
  /** Set the newly created module data */
  | { type: "SET_NEW_MODULE_DATA"; payload: NewMddule | null }
  /** Toggle the metadata form visibility */
  | { type: "SET_SHOW_METADATA_FORM" }
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
  newModuleData: null,
  showMetadataForm: false,
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
      // Auto-show metadata form when parcours list is set
      return { ...state, parcoursList: action.payload, showMetadataForm: true };

    case "SET_PARCOURS_ID":
      return { ...state, parcoursId: action.payload };

    case "SET_FORMATION_ID":
      return { ...state, formationId: action.payload };

    case "SET_MODE":
      return { ...state, mode: action.payload };

    case "SET_NEW_MODULE_DATA":
      return { ...state, newModuleData: action.payload };

    case "SET_FILE":
      return { ...state, file: action.payload };

    case "SET_SHOW_METADATA_FORM":
      return { ...state, showMetadataForm: !state.showMetadataForm };

    case "SET_SKILLS_AND_CONTACTS":
      // Auto-show metadata form when skills and contacts are fetched
      return {
        ...state,
        contacts: action.payload.contacts,
        skills: action.payload.skills,
        showMetadataForm: true,
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

      // Validate form fields
      const isValid = await trigger();
      if (!isValid) return;

      // Prepare FormData for multipart upload (module metadata + image)
      const formData = new FormData();
      const module = {
        ...getValues(),
        formationId: state.formationId,
      };

      formData.append("module", JSON.stringify(module));
      if (state.file) formData.append("image", state.file);

      // Handler for successful module creation
      setIsLoading(true);
      apiClient
        .post("/formation/new-module", formData)
        .then((res) => {
          const result = res.data as { data: ModuleData; message: string };
          toast.success(result.message);
          dispatch({
            type: "SET_NEW_MODULE_DATA",
            payload: result.data as unknown as NewMddule,
          });
        })
        .catch(
          (err) => setError(err?.response?.data?.message ?? "Erreur inconnue"),
        )
        .finally(() => setIsLoading(false));
    },
    [state.formationId, state.file, getValues, trigger],
  );

  /**
   * Handle file selection and store in state
   * @param file File selected by user (or null to clear)
   */
  const handleSetFile = useCallback((file: File | null) => {
    dispatch({ type: "SET_FILE", payload: file });
  }, []);

  /**
   * Fetch the list of parcours for the selected formation
   * @param formationId Optional formation ID; defaults to current state if not provided
   */
  const getParcoursList = useCallback(
    (formationId?: number) => {
      const fid = formationId ?? state.formationId;
      if (!fid) return;

      const processData = (parcoursData: Item[]) => {
        dispatch({ type: "SET_PARCOURS_LIST", payload: parcoursData });
      };

      setIsLoading(true);
      apiClient
        .get(`/parcours/select/${fid}`)
        .then((res) => processData(res.data as Item[]))
        .catch(
          (err) => setError(err?.response?.data?.message ?? "Erreur inconnue"),
        )
        .finally(() => setIsLoading(false));
    },
    [state.formationId],
  );

  /**
   * Toggle metadata form visibility and fetch parcours list if needed
   */
  const toggleShowMetadataForm = useCallback(() => {
    if (state.formationId) {
      getParcoursList(state.formationId);
    }
  }, [state.formationId, getParcoursList]);

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
          const result = res.data as SuccessWithMessage & {
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
   * Submit module metadata (duration, contacts, skills) to attach module to parcours
   * Validates duration using Zod schema before submission
   */
  const handleMetadataSubmit = useCallback(async () => {
    const duration = (getValues("duration") as number) ?? 0;

    setIsLoading(true);
    apiClient
      .post("/modules/metadata", {
        parcoursId: state.parcoursId,
        moduleId: state.newModuleData?.id,
        duration,
        contactIds: state.currentContacts.map((c) => c.id ?? []),
        skillIds: state.currentSkills.map((s) => s.id ?? []),
      })
      .then((res) => {
        const result = res.data as SuccessWithMessage;
        toast.success(result.message);
        nav("/admin/module");
      })
      .catch(
        (err) => setError(err?.response?.data?.message ?? "Erreur inconnue"),
      )
      .finally(() => setIsLoading(false));
  }, [
    getValues,
    state.parcoursId,
    state.newModuleData?.id,
    state.currentContacts,
    state.currentSkills,
    nav,
  ]);

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

    // Get modal element from DOM (DaisyUI modal element)
    const modal = document.getElementById(
      "back_to_module_list_modal",
    ) as HTMLDialogElement | null;

    if (!modal) return;

    // Control modal visibility using DaisyUI API
    if (state.showModal) {
      modal.close();
    } else {
      modal.showModal();
    }
  }, [state.showModal]);

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
    toggleShowMetadataForm,
    handlePickParcours,
    setCurrentContacts,
    setCurrentSkills,
    handleMetadataSubmit,
    handleBackToModuleList,
    setImageBase64,
    toggleModal,
  };
};

export default useNewModule;
