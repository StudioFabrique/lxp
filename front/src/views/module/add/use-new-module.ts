import { useCallback, useEffect, useReducer } from "react";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import useForm from "../../../components/UI/forms/hooks/use-form";
import { moduleCreateSchema } from "../../../lib/validation/parcours-edit/module-create-schema";
import { ModuleData } from "../../../utils/interfaces/new-module";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";

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
      type: "SET_INITIAL_METADATAS";
      payload: { contacts: Contact[]; skills: Skill[] };
    };
const initialState: State = {
  parcoursId: null,
  formationId: null,
  mode: "create",
  formationList: [],
  parcoursList: [],
  newModuleData: null,
  showMetadataForm: false,
  file: null,
};

const newModuleReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_FORMATION_LIST":
      return { ...state, formationList: action.payload };
    case "SET_PARCOURS_LIST":
      return { ...state, parcoursList: action.payload };
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
      };
    case "SET_SHOW_METADATA_FORM":
      return { ...state, showMetadataForm: !state.showMetadataForm };

    default:
      return state;
  }
};

const useNewModule = () => {
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

  const toggleShowMetadataForm = () => {
    dispatch({ type: "SET_SHOW_METADATA_FORM" });
  };

  const handlePickParcours = (id: number) => {
    dispatch({ type: "SET_PARCOURS_ID", payload: id });
    const applyData = (data: any) => {
      console.log({ data });
      dispatch({ type: "SET_SHOW_METADATA_FORM" });
      dispatch({});
    };
    sendRequest(
      {
        path: `/skills-contacts/${state.parcoursId}`,
      },
      applyData
    );
  };

  useEffect(() => {
    handleGetFormation();
  }, [handleGetFormation]);

  /**
   * requête qui retourne la liste des parcours liés à la formation sélectionnée
   */
  useEffect(() => {
    if (state.formationId) {
      const processData = (data: Item[]) => {
        dispatch({ type: "SET_PARCOURS_LIST", payload: data });
      };
      sendRequest(
        {
          path: `/parcours/parcours-by-formation/${state.formationId}`,
        },
        processData
      );
    }
  }, [sendRequest, state.formationId]);

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
  };
};

export default useNewModule;
