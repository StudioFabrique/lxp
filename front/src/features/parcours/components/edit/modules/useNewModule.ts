import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { moduleCreateSchema } from "../../../parcours.schema";
import { scrollToTop } from "../../../../../utils/helpers/scroll-to-top";
import { moduleReducer, initialState } from "./useNewModuleReducer";
import type SuccessWithMessage from "../../../../../../src/utils/interfaces/success-with-message";
import type {
  MetadataList,
  Metadatas,
  ModuleData,
} from "../../../../../../src/utils/interfaces/new-module";
import Contact from "../../../../../../src/utils/interfaces/contact";
import Skill from "../../../../../../src/utils/interfaces/skill";
import { useParcoursDispatch } from "../../../store/ParcoursContext";
import { parcoursApi } from "../../../api/parcours.api";

const useNewModule = () => {
  const { id } = useParams();
  const refForm = useRef<HTMLFormElement | null>(null);
  const reduxDispatch = useParcoursDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [state, dispatch] = useReducer(moduleReducer, initialState);

  const {
    register,
    handleSubmit: _rhfHandleSubmit,
    reset,
    formState: { errors },
    getValues,
    trigger,
  } = useForm({
    resolver: zodResolver(moduleCreateSchema),
  });

  const getParcoursModules = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await parcoursApi.queries.getModules(+id!);
      dispatch({ type: "SET_MODULES", payload: data.modules });
      dispatch({ type: "SET_PARCOURS", payload: data.parcoursData });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erreur inconnue";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleSubmitNewModule = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger();
    if (!isValid) return;

    const formData = new FormData();
    const values = getValues();

    const duration = values.duration ?? 0;
    const moduleData = {
      ...values,
      formationId: state.parcours?.formationId,
      parcoursId: +id!,
      duration: duration === 0 || isNaN(duration) ? 1 : duration,
      contacts: state.currentContacts.map((item) => item.id),
      skills: state.currentSkills.map((item) => item.id),
    };

    formData.append("module", JSON.stringify(moduleData));
    if (state.file) formData.append("image", state.file);

    try {
      const data = await parcoursApi.mutations.createModule(formData);
      reset();
      dispatch({ type: "MODULE_CREATED", payload: data.data });
      reduxDispatch({ type: "ADD_NEW_MODULE", payload: data.data });
      scrollToTop();
    } catch {
      toast.error("Erreur lors de la création du module");
    }
  };

  const handleCancelForm = () => {
    reset();
    dispatch({ type: "CANCEL_FORM" });
    scrollToTop();
  };

  const showDeleteModal = (id: number) => {
    const item = state.modules.find((module) => module.id === id);
    dispatch({ type: "SET_MODULE_TO_DELETE", payload: item ?? null });
  };

  const handleDeleteModule = async () => {
    try {
      const data: SuccessWithMessage = await parcoursApi.mutations.deleteModule(
        state.moduleToDelete!.id,
      );
      dispatch({ type: "REMOVE_MODULE", payload: state.moduleToDelete!.id });
      dispatch({ type: "CLOSE_DELETE_MODAL" });
      reduxDispatch({
        type: "REMOVE_MODULE",
        payload: state.moduleToDelete!.id,
      });
      toast.success(data.message);
    } catch {
      toast.error("Erreur lors de la suppression du module");
    }
  };

  const handleCancelDeletion = () => {
    dispatch({ type: "SET_MODULE_TO_DELETE", payload: null });
  };

  const handleDuplicateModule = () => {
    if (!state.metadataList) {
      getMetadataList();
    } else {
      dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
      const drawer = document.getElementById("duplicate_module_drawer");
      (drawer as HTMLDialogElement).click();
    }
  };

  const getMetadataList = async () => {
    try {
      const data: MetadataList[] =
        await parcoursApi.queries.getModulesByFormation(
          state.parcours!.formationId,
        );
      dispatch({ type: "SET_METADATA_LIST", payload: data });
      dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
      const drawer = document.getElementById("duplicate_module_drawer");
      (drawer as HTMLDialogElement).click();
    } catch {
      toast.error("Erreur lors du chargement des modules");
    }
  };

  const handleCloseDuplicateModal = () => {
    dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
  };

  const handleCopyModule = (module: MetadataList, metadatas: Metadatas) => {
    dispatch({
      type: "PREPARE_DUPLICATE",
      payload: { metas: metadatas, image: module.thumb },
    });

    reset({
      moduleId: module.id,
      title: module.title,
      description: module.description,
      quizInstructions: module.quizInstructions,
    });
    const drawer = document.getElementById("duplicate_module_drawer");
    (drawer as HTMLDialogElement).click();
  };

  const handleUpdateModule = (moduleToUpdate: ModuleData) => {
    dispatch({
      type: "UPDATE_MODULE",
      payload: {
        id: moduleToUpdate.id,
        contacts: moduleToUpdate.contacts,
        skills: moduleToUpdate.skills,
        duration: moduleToUpdate.duration ? +moduleToUpdate.duration : 1,
      },
    });
    reset({
      title: moduleToUpdate.title,
      description: moduleToUpdate.description,
      duration: moduleToUpdate.duration,
      quizInstructions: moduleToUpdate.quizInstructions,
    });
  };

  const handleSubmitDuplicateModule = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await trigger();
    if (!isValid) return;

    const isEmptyObject = (obj: unknown) =>
      obj == null ||
      (typeof obj === "object" &&
        !Array.isArray(obj) &&
        Object.keys(obj).length === 0);

    try {
      if (isEmptyObject(state.moduleToDuplicate)) {
        const data = await parcoursApi.mutations.duplicateModuleByMetadata({
          parcoursId: +id!,
          moduleId: getValues().moduleId!,
          contactIds: state.currentContacts.map((item) => item.id ?? []),
          skillIds: state.currentSkills.map((item) => item.id ?? []),
          duration: getValues().duration ?? 0,
        });
        reset();
        dispatch({ type: "MODULE_CREATED", payload: data.response });
        toast.success(data.message);
        reduxDispatch({ type: "ADD_NEW_MODULE", payload: data.response });
        scrollToTop();
      } else {
        const data = await parcoursApi.mutations.duplicateModule(
          state.moduleToDuplicate!.id,
          {
            duration: getValues().duration ?? 0,
            contactsIds: state.currentContacts.map((item) => item.id),
            skillsIds: state.currentSkills.map((item) => item.id),
            parcoursId: +id!,
          },
        );
        reset();
        dispatch({ type: "MODULE_CREATED", payload: data.response });
        toast.success(data.message);
        scrollToTop();
      }
    } catch {
      toast.error("Erreur lors de la duplication du module");
    }
  };

  const handleSubmitUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = await trigger();
    if (!isValid) return;

    try {
      const data = await parcoursApi.mutations.updateModule({
        module: {
          id: state.moduleToUpdate,
          ...getValues(),
          contactsIds: state.currentContacts
            ? state.currentContacts.map((item) => item.id)
            : [],
          bonusSkillsIds: state.currentSkills
            ? state.currentSkills.map((item) => item.id)
            : [],
        },
      });
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
        reduxDispatch({ type: "REPLACE_MODULE", payload: data.response });
        reset();
        scrollToTop();
      }
    } catch {
      toast.error("Erreur lors de la mise à jour du module");
    }
  };

  useEffect(() => {
    getParcoursModules();
  }, [getParcoursModules]);

  useEffect(() => {
    if (state.showForm && refForm.current) {
      refForm.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [state.showForm]);

  useEffect(() => {
    if (error && error.length > 0) {
      if (error === "MODULE_ALREADY_EXISTS") {
        dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: true });
      } else {
        toast.error(error);
      }
    }
  }, [error]);

  useEffect(() => {
    const modal = document.getElementById("duplicate_module_modal");
    if (state.showDuplicateModal) {
      (modal as HTMLDialogElement).showModal();
    } else {
      (modal as HTMLDialogElement).close();
    }
  }, [state.showDuplicateModal]);

  return {
    id,
    ...state,
    register,
    errors,
    getValues,
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
    moduleToDelete: state.moduleToDelete,
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
