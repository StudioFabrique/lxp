import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  moduleCreateSchema,
  type ModuleCreateFormValues,
} from "../../../parcours.schema";
import { scrollToTop } from "../../../../../utils/helpers/scroll-to-top";
import { moduleReducer, initialState } from "./useNewModuleReducer";
import type SuccessWithMessage from "../../../../../../src/utils/interfaces/success-with-message";
import type {
  ModuleData,
  SourceModule,
} from "../../../interfaces/new-module";
import Contact from "../../../../../../src/utils/interfaces/contact";
import Skill from "../../../../../../src/utils/interfaces/skill";
import { parcoursApi } from "../../../api/parcours.api";
import { useQueryClient } from "@tanstack/react-query";
import { parcoursKeys } from "../../../api/parcours.keys";

const emptyModuleFormValues = {
  moduleId: undefined,
  title: "",
  description: "",
  duration: undefined,
  quizInstructions: "",
};

const useNewModule = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const moduleIdParam = searchParams.get("moduleId");
  const requestedModuleId =
    moduleIdParam !== null ? Number(moduleIdParam) : null;
  const handledModuleIdRef = useRef<number | null>(null);
  const refForm = useRef<HTMLFormElement | null>(null);
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);
  const isModuleSubmissionRunning = useRef(false);
  const [error, setError] = useState<string>("");

  const [state, dispatch] = useReducer(moduleReducer, initialState);

  const {
    register,
    reset,
    formState: { errors },
    getValues,
    trigger,
  } = useForm<ModuleCreateFormValues>({
    resolver: zodResolver(moduleCreateSchema),
    defaultValues: emptyModuleFormValues,
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

  const runModuleSubmission = async (submission: () => Promise<void>) => {
    if (isModuleSubmissionRunning.current) return;

    isModuleSubmissionRunning.current = true;
    setIsSubmittingModule(true);
    try {
      await submission();
    } finally {
      isModuleSubmissionRunning.current = false;
      setIsSubmittingModule(false);
    }
  };

  const handleSubmitNewModule = async (e: React.FormEvent) => {
    e.preventDefault();
    await runModuleSubmission(async () => {
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
        await queryClient.invalidateQueries({
          queryKey: parcoursKeys.detail(+id!),
        });
        scrollToTop();
      } catch {
        toast.error("Erreur lors de la création du module");
      }
    });
  };

  const handleCancelForm = () => {
    reset(emptyModuleFormValues);
    dispatch({ type: "CANCEL_FORM" });
    scrollToTop();
  };

  const handleCreateNewModule = () => {
    reset(emptyModuleFormValues);
    dispatch({ type: "START_CREATE" });
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
      await queryClient.invalidateQueries({
        queryKey: parcoursKeys.detail(+id!),
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
    if (!state.sourceModules) {
      getSourceModules();
    } else {
      dispatch({ type: "SET_SHOW_DUPLICATE_MODAL", payload: false });
      const drawer = document.getElementById("duplicate_module_drawer");
      (drawer as HTMLDialogElement).click();
    }
  };

  const getSourceModules = async () => {
    try {
      const data: SourceModule[] =
        await parcoursApi.queries.getModulesByFormation(
          state.parcours!.formationId,
        );
      dispatch({ type: "SET_SOURCE_MODULES", payload: data });
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

  const handleCopyModule = (module: SourceModule) => {
    dispatch({
      type: "PREPARE_DUPLICATE",
      payload: { source: module, image: module.thumb },
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

  const handleUpdateModule = useCallback((moduleToUpdate: ModuleData) => {
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
  }, [reset]);

  const handleSubmitDuplicateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    await runModuleSubmission(async () => {
      const isValid = await trigger();
      if (!isValid) return;

      const isEmptyObject = (obj: unknown) =>
        obj == null ||
        (typeof obj === "object" &&
          !Array.isArray(obj) &&
          Object.keys(obj).length === 0);

      try {
        if (!isEmptyObject(state.moduleToDuplicate)) {
          const data = await parcoursApi.mutations.duplicateModule(
            state.moduleToDuplicate!.id,
            {
              duration: getValues().duration ?? 0,
              contactsIds: state.currentContacts
                .map((item) => item.id)
                .filter((item): item is number => typeof item === "number"),
              skillsIds: state.currentSkills
                .map((item) => item.id)
                .filter((item): item is number => typeof item === "number"),
              parcoursId: +id!,
            },
          );
          reset();
          dispatch({ type: "MODULE_CREATED", payload: data.response });
          await queryClient.invalidateQueries({
            queryKey: parcoursKeys.detail(+id!),
          });
          toast.success(data.message);
          scrollToTop();
        }
      } catch {
        toast.error("Erreur lors de la duplication du module");
      }
    });
  };

  const handleSubmitUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    await runModuleSubmission(async () => {
      const isValid = await trigger();
      if (!isValid) return;

      try {
        const updatedModule = {
          id: state.moduleToUpdate,
          ...getValues(),
          contactsIds: state.currentContacts
            ? state.currentContacts.map((item) => item.id)
            : [],
          bonusSkillsIds: state.currentSkills
            ? state.currentSkills.map((item) => item.id)
            : [],
        };
        const formData = new FormData();
        formData.append("module", JSON.stringify(updatedModule));
        if (state.file) formData.append("image", state.file);
        const data = await parcoursApi.mutations.updateModule(formData);
        if (data.success) {
          dispatch({
            type: "SUCCESSFUL_MODULE_UPDATE",
            payload: {
              id: data.response.id,
              contacts: data.response.contacts,
              skills: data.response.skills,
              duration: data.response.duration ? +data.response.duration : 0,
              title: data.response.title,
              description: data.response.description,
              quizInstructions: data.response.quizInstructions,
            },
          });
          toast.success(data.message);
          await queryClient.invalidateQueries({
            queryKey: parcoursKeys.detail(+id!),
          });
          reset();
          scrollToTop();
        }
      } catch {
        toast.error("Erreur lors de la mise à jour du module");
      }
    });
  };

  useEffect(() => {
    // Le chargement est volontairement relancé lorsque l'identifiant du parcours change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void getParcoursModules();
  }, [getParcoursModules]);

  useEffect(() => {
    if (
      requestedModuleId === null ||
      !Number.isInteger(requestedModuleId) ||
      handledModuleIdRef.current === requestedModuleId
    ) {
      return;
    }

    const requestedModule = state.modules.find(
      (module) => module.id === requestedModuleId,
    );
    if (!requestedModule) return;

    handledModuleIdRef.current = requestedModuleId;
    handleUpdateModule(requestedModule);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("moduleId");
    setSearchParams(nextSearchParams, { replace: true });
  }, [
    handleUpdateModule,
    requestedModuleId,
    searchParams,
    setSearchParams,
    state.modules,
  ]);

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
    isSubmittingModule,
    refForm,
    handleSubmit: handleSubmitNewModule,
    handleCancelForm,
    handleCreateNewModule,
    setCurrentContacts: (contacts: Contact[]) =>
      dispatch({ type: "SET_CURRENT_CONTACTS", payload: contacts }),
    setCurrentSkills: (skills: Skill[]) =>
      dispatch({ type: "SET_CURRENT_SKILLS", payload: skills }),
    setFile: (file: File | null) =>
      dispatch({ type: "SET_FILE", payload: file }),
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
