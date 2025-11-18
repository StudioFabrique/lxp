import { useCallback, useEffect, useReducer } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import useForm from "../../../components/UI/forms/hooks/use-form";
import {
  moduleCreateSchema,
  moduleMetadataCreateSchema,
} from "../../../lib/validation/parcours-edit/module-create-schema";
import { ModuleData } from "../../../utils/interfaces/new-module";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import SuccessWithMessage from "../../../utils/interfaces/success-with-message";
import { ZodError } from "zod";
import { validationErrors } from "../../../helpers/validate";
import { useNavigate } from "react-router-dom";

export type Item = {
  id: number;
  title: string;
};

export type NewMddule = {
  id: number;
  title: string;
  description: string;
  thumb: string | null;
};

type State = {
  file: File | null;
  parcoursId: number | null;
  formationId: number | null;
  mode: "create" | "edit";
  formationList: Item[];
  parcoursList: Item[];
  newModuleData: NewMddule | null;
  showMetadataForm: boolean;
  currentContacts: Contact[];
  currentSkills: Skill[];
  contacts: Contact[] | null;
  skills: Skill[] | null;
  image: string | undefined;
};

type Action =
  | { type: "SET_FORMATION_LIST"; payload: Item[] }
  | { type: "SET_PARCOURS_LIST"; payload: Item[] }
  | { type: "SET_PARCOURS_ID"; payload: number | null }
  | { type: "SET_FORMATION_ID"; payload: number | null }
  | { type: "SET_MODE"; payload: "create" | "edit" }
  | { type: "SET_NEW_MODULE_DATA"; payload: NewMddule | null }
  | { type: "SET_SHOW_METADATA_FORM" }
  | { type: "RESET_FORM" }
  | { type: "SET_FILE"; payload: File | null }
  | {
      type: "SET_SKILLS_AND_CONTACTS";
      payload: { contacts: Contact[]; skills: Skill[] };
    }
  | { type: "SET_CURRENT_CONTACTS"; payload: Contact[] }
  | { type: "SET_CURRENT_SKILLS"; payload: Skill[] }
  | { type: "RESET_METADATA_FORM" }
  | { type: "SET_IMAGE_BASE64"; payload: string | undefined };

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
};

const newModuleReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FORMATION_LIST":
      return { ...state, formationList: action.payload };
    case "SET_PARCOURS_LIST":
      return { ...state, parcoursList: action.payload, showMetadataForm: true };
    case "SET_PARCOURS_ID":
      return { ...state, parcoursId: action.payload };
    case "SET_FORMATION_ID":
      return { ...state, formationId: action.payload };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_NEW_MODULE_DATA":
      return {
        ...state,
        newModuleData: action.payload,
      };
    case "SET_FILE":
      return { ...state, file: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        parcoursId: null,
        file: null,
        image: undefined,
      };
    case "SET_SHOW_METADATA_FORM":
      return { ...state, showMetadataForm: !state.showMetadataForm };
    case "SET_SKILLS_AND_CONTACTS":
      return {
        ...state,
        contacts: action.payload.contacts,
        skills: action.payload.skills,
        showMetadataForm: true,
      };
    case "SET_CURRENT_CONTACTS":
      return {
        ...state,
        currentContacts: action.payload,
      };
    case "SET_CURRENT_SKILLS":
      return {
        ...state,
        currentSkills: action.payload,
      };
    case "RESET_METADATA_FORM":
      return {
        ...state,
        parcoursId: null,
        currentContacts: [],
        currentSkills: [],
        showMetadataForm: false,
      };
    case "SET_IMAGE_BASE64":
      return {
        ...state,
        image: action.payload,
      };
    default:
      return state;
  }
};

const useNewModule = () => {
  const nav = useNavigate();
  const [state, dispatch] = useReducer(newModuleReducer, initialState);
  const { sendRequest, error, isLoading } = useHttp();
  const { errors, onChangeValue, onValidateForm, values, onResetForm } =
    useForm({}, moduleCreateSchema);
  const data = { values, onChangeValue, errors };

  const handleGetFormation = useCallback(() => {
    const processData = (data: Array<Item>) => {
      dispatch({ type: "SET_FORMATION_LIST", payload: data });
    };
    sendRequest(
      {
        path: "/formation",
      },
      processData
    );
  }, [sendRequest]);

  const handlePickFormation = (id: number) => {
    dispatch({ type: "SET_FORMATION_ID", payload: id });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.formationId) {
      toast.error("Veuillez sélectionner une formation.");
      return;
    }

    if (!onValidateForm()) return;

    const formData = new FormData();
    console.log(values);

    const module = {
      ...data.values,
      formationId: state.formationId,
    };

    formData.append("module", JSON.stringify(module));
    if (state.file) formData.append("image", state.file);

    const applyData = (data: { data: ModuleData; message: string }) => {
      toast.success(data.message);
      dispatch({ type: "SET_NEW_MODULE_DATA", payload: data.data });
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

  const handleSetFile = (file: File | null) => {
    console.log({ file });

    dispatch({ type: "SET_FILE", payload: file });
  };

  const handleResetForm = () => {
    dispatch({ type: "RESET_FORM" });
    onResetForm();
  };

  const getParcoursList = useCallback(
    (formationId?: number) => {
      const fid = formationId ?? state.formationId;
      if (!fid) {
        console.warn("getParcoursList called without formationId");
        return;
      }

      const processData = (data: Item[]) => {
        console.log(data);

        dispatch({ type: "SET_PARCOURS_LIST", payload: data });
      };

      console.log("bye world!", fid);
      sendRequest(
        {
          path: `/parcours/select/${fid}`,
        },
        processData
      );
    },
    [dispatch, sendRequest, state.formationId]
  );

  const toggleShowMetadataForm = () => {
    console.log("triggered");

    // Use the current state value or pass explicit id to ensure correct value
    const fid = state.formationId;
    if (fid) {
      console.log("hello world!");
      // pass the id explicitly to avoid stale closures
      getParcoursList(fid);
    }
  };

  const handlePickParcours = (id: number) => {
    dispatch({ type: "SET_PARCOURS_ID", payload: id });
    const applyData = (
      data: SuccessWithMessage & { contacts: Contact[]; skills: Skill[] }
    ) => {
      console.log(data);

      dispatch({
        type: "SET_SKILLS_AND_CONTACTS",
        payload: { contacts: data.contacts, skills: data.skills },
      });
    };

    // Use the passed id instead of state.parcoursId (state update is async)
    sendRequest(
      {
        path: `/parcours/skills-contacts/${id}`,
      },
      applyData
    );
  };

  const handleMetadataSubmit = () => {
    try {
      moduleMetadataCreateSchema.parse({
        duration: values.duration,
      });
      const applyData = (data: SuccessWithMessage) => {
        toast.success(data.message);
      };
      sendRequest(
        {
          path: "/modules/metadata",
          method: "post",
          body: {
            parcoursId: state.parcoursId,
            moduleId: state.newModuleData?.id,
            duration: values.duration,
            contactIds: state.currentContacts.map((c) => c.id) ?? [],
            skillIds: state.currentSkills.map((s) => s.id) ?? [],
          },
        },
        applyData
      );
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        console.log({ errors });
        toast.error("Des erreurs sont présentes dans le formulaire.");
        return;
      }
    }
  };

  const setCurrentContacts = (contacts: Contact[]) => {
    dispatch({ type: "SET_CURRENT_CONTACTS", payload: contacts });
  };

  const setCurrentSkills = (skills: Skill[]) => {
    dispatch({ type: "SET_CURRENT_SKILLS", payload: skills });
  };

  const resetMetadata = () => {
    dispatch({ type: "RESET_METADATA_FORM" });
    onResetForm();
    nav("/admin/module");
  };

  const handleBackToModuleList = () => {
    dispatch({ type: "RESET_FORM" });
    nav("/admin/module");
  };

  const setImageBase64 = (base64: string | null) => {
    dispatch({ type: "SET_IMAGE_BASE64", payload: base64 ?? undefined });
  };

  useEffect(() => {
    handleGetFormation();
  }, [handleGetFormation]);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  useEffect(() => {
    console.log(state.file);
  }, [state.file]);

  return {
    ...state,
    isLoading,
    data,
    handleSubmit,
    handlePickFormation,
    handleSetFile,
    handleResetForm,
    toggleShowMetadataForm,
    handlePickParcours,
    setCurrentContacts,
    setCurrentSkills,
    handleMetadataSubmit,
    resetMetadata,
    handleBackToModuleList,
    setImageBase64,
  };
};

export default useNewModule;
