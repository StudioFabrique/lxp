import { useCallback, useEffect, useReducer, useRef } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useHttp from "../../../hooks/use-http";
import useForm from "../../UI/forms/hooks/use-form";
import { moduleCreateSchema } from "../../../lib/validation/parcours-edit/module-create-schema";
import { scrollToTop } from "../../../helpers/scrollToTop";
import { moduleReducer, initialState } from "./useNewModuleReducer";
import SuccessWithMessage from "../../../utils/interfaces/success-with-message";
import {
  MetadataList,
  Metadatas,
  ModuleData,
  Parcours,
} from "../../../utils/interfaces/new-module";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";

/**
 * Custom hook for managing module creation and display within a parcours
 *
 * Refactored to use useReducer for better state management and reduced complexity
 */
const useNewModule = () => {
  const { id } = useParams();
  const { sendRequest, isLoading, error } = useHttp();
  const refForm = useRef<HTMLFormElement | null>(null);

  // Single useReducer replaces 11 useState hooks
  const [state, dispatch] = useReducer(moduleReducer, initialState);

  // Form management remains separate (UI-specific logic)
  const {
    values,
    onChangeValue,
    onResetForm,
    errors,
    onValidateForm,
    initValues,
  } = useForm({}, moduleCreateSchema);

  const data = { values, onChangeValue, errors };

  /**
   * Fetches modules and parcours data from the API
   */
  const getParcoursModules = useCallback(() => {
    const applyData = (data: {
      modules: ModuleData[];
      parcoursData: Parcours;
    }) => {
      dispatch({ type: "SET_MODULES", payload: data.modules });
      dispatch({ type: "SET_PARCOURS", payload: data.parcoursData });
    };
    sendRequest({ path: `/modules/${id}` }, applyData);
  }, [id, sendRequest]);

  /**
   * Handles form submission for creating a new module
   */
  const handleSubmitNewModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onValidateForm()) return;

    const formData = new FormData();
    const module = {
      ...data.values,
      formationId: state.parcours?.formationId,
      parcoursId: +id!,
      duration:
        +data.values.duration === 0 || isNaN(+data.values.duration)
          ? 1
          : +data.values.duration,
      contacts: state.currentContacts.map((item) => item.id),
      skills: state.currentSkills.map((item) => item.id),
    };

    formData.append("module", JSON.stringify(module));
    if (state.file) formData.append("image", state.file);

    const applyData = (data: { data: ModuleData; message: string }) => {
      onResetForm();
      // Single action handles multiple state updates
      dispatch({ type: "MODULE_CREATED", payload: data.data });
      scrollToTop();
    };

    sendRequest(
      {
        path: "/formation/new-module",
        method: "post",
        body: formData,
      },
      applyData
    );
  };

  /**
   * Handles form cancellation
   */
  const handleCancelForm = () => {
    onResetForm();
    // ✅ Single action handles multiple state updates
    dispatch({ type: "CANCEL_FORM" });
    scrollToTop();
  };

  /**
   * Shows delete confirmation modal
   */
  const showDeleteModal = (id: number) => {
    const item = state.modules.find((module) => module.id === id);
    dispatch({ type: "SET_MODULE_TO_DELETE", payload: item ?? null });
  };

  /**
   * Deletes the selected module
   */
  const handleDeleteModule = () => {
    const applyData = (data: SuccessWithMessage) => {
      dispatch({ type: "REMOVE_MODULE", payload: state.moduleToDelete!.id });
      dispatch({ type: "CLOSE_DELETE_MODAL" });
      toast.success(data.message);
    };

    sendRequest(
      {
        path: `/modules/${state.moduleToDelete!.id}`,
        method: "delete",
      },
      applyData
    );
  };

  /**
   * Cancels module deletion
   */
  const handleCancelDeletion = () => {
    dispatch({ type: "SET_MODULE_TO_DELETE", payload: null });
  };

  /**
   * Handles module duplication flow
   */
  const handleDuplicateModule = () => {
    if (!state.metadataList) {
      getMetadataList();
    } else {
      dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
      const drawer = document.getElementById("duplicate_module_drawer");
      (drawer as HTMLDialogElement).click();
    }
  };

  /**
   * Fetches list of modules with metadata for duplication
   */
  const getMetadataList = () => {
    const applyData = (data: MetadataList[]) => {
      dispatch({ type: "SET_METADATA_LIST", payload: data });
      dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
      const drawer = document.getElementById("duplicate_module_drawer");
      (drawer as HTMLDialogElement).click();
    };

    sendRequest(
      {
        path: `/modules/formation/${state.parcours!.formationId}/true`,
      },
      applyData
    );
  };

  /**
   * Closes the duplicate warning modal
   */
  const handleCloseDuplicateModal = () => {
    dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
  };

  /**
   * Prepares form for duplicating an existing modules
   */
  const handleCopyModule = (module: MetadataList, metadatas: Metadatas) => {
    // ✅ Single action handles complex state transition
    dispatch({
      type: "PREPARE_DUPLICATE",
      payload: { metas: metadatas, image: module.thumb },
    });
    initValues({
      title: module.title,
      description: module.description,
    });
    const drawer = document.getElementById("duplicate_module_drawer");
    (drawer as HTMLDialogElement).click();
  };

  const handleUpdateModule = (moduleToUpddate: ModuleData) => {
    console.log("SKILLS", moduleToUpddate.skills);

    dispatch({
      type: "UPDATE_MODULE",
      payload: {
        id: moduleToUpddate.id,
        contacts: moduleToUpddate.contacts,
        skills: moduleToUpddate.skills,
        duration: moduleToUpddate.duration ? +moduleToUpddate.duration : 1,
      },
    });
    initValues({
      title: moduleToUpddate.title,
      description: moduleToUpddate.description,
      duration: moduleToUpddate.duration,
    });
  };

  const handleSubmitDuplicateModule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!onValidateForm()) return;
    const applyData = (data: {
      success: boolean;
      message: string;
      response: ModuleData;
    }) => {
      onResetForm();
      dispatch({ type: "MODULE_CREATED", payload: data.response });
      toast.success(data.message);
      scrollToTop();
    };
    sendRequest(
      {
        path: `/modules/duplicate/${state.moduleToDuplicate!.id}`,
        method: "post",
        body: {
          duration: +data.values.duration,
          contactsIds: state.currentContacts.map((item) => item.id),
          skillsIds: state.currentSkills.map((item) => item.id),
          parcoursId: +id!,
        },
      },
      applyData
    );
  };

  const handleSubmitUpdateModule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!onValidateForm()) return;
    const applyData = (data: {
      success: boolean;
      message: string;
      response: ModuleData;
    }) => {
      if (data.success) {
        dispatch({
          type: "SUCCESSFUL_MODULE_UPDATE",
          payload: {
            id: data.response.id,
            contacts: data.response.contacts,
            skills: data.response.skills,
            duration: data.response.duration ? +data.response.duration : 0,
          },
        });
        toast.success(data.message);
        onResetForm();
        scrollToTop();
      }
    };
    sendRequest(
      {
        path: `/modules/new-module/update/`,
        method: "put",
        body: {
          module: {
            id: state.moduleToUpdate,
            ...data.values,
            contactsIds: state.currentContacts.map((item) => item.id),
            bonusSkillsIds: state.currentSkills.map((item) => item.id),
          },
        },
      },
      applyData
    );
  };

  useEffect(() => {
    getParcoursModules();
  }, [getParcoursModules]);

  // Effect for delete modal
  useEffect(() => {
    const modal = document.getElementById("two_buttons_modal");
    if (state.moduleToDelete) {
      (modal as HTMLDialogElement).showModal();
    } else {
      (modal as HTMLDialogElement).close();
    }
  }, [state.moduleToDelete]);

  // Effect for form scrolling
  useEffect(() => {
    if (state.showForm && refForm.current) {
      refForm.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.showForm]);

  // Effect for error handling
  useEffect(() => {
    if (error && error.length > 0) {
      if (error === "MODULE_ALREADY_EXISTS") {
        dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: true });
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  // Effect for duplicate modal
  useEffect(() => {
    const modal = document.getElementById("duplicate_module_modal");
    if (state.showDuplicateModal) {
      (modal as HTMLDialogElement).showModal();
    } else {
      (modal as HTMLDialogElement).close();
    }
  }, [state.showDuplicateModal]);

  // Return state and handlers
  return {
    id,
    ...state, // ✅ Spread all state properties
    data,
    isLoading,
    refForm,
    handleSubmit: handleSubmitNewModule,
    handleCancelForm,
    setCurrentContacts: (contacts: Contact[]) =>
      dispatch({ type: "SET_CURRENT_CONTACTS", payload: contacts }),
    setCurrentSkills: (skills: Skill[]) =>
      dispatch({ type: "SET_CURRENT_SKILLS", payload: skills }),
    setFile: (file: File | null) =>
      dispatch({ type: "SET_FILE", payload: file }),
    setShowForm: (show: boolean) =>
      dispatch({ type: "SET_SHOW_FORM", payload: show }),
    showDeleteModal,
    handleDeleteModule,
    handleCancelDeletion,
    handleDuplicateModule,
    handleCopyModule,
    handleCloseDuplicateModal,
    error,
    handleUpdateModule,
    handleSubmitUpdateModule,
    handleSubmitDuplicateModule,
  };
};

export default useNewModule;
