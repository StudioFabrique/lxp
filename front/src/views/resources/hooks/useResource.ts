import { useCallback, useEffect, useReducer } from "react";
import { Activity } from "../../../utils/interfaces/activity";
import Resource from "../../../utils/interfaces/resource";
import Tag from "../../../utils/interfaces/tag";
import useHttp from "../../../hooks/use-http";
import useForm from "../../../components/UI/forms/hooks/use-form";
import z from "zod";
import { regexGeneric } from "../../../utils/constantes";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useTextActivity from "./useTextActivity";
import { ACTIVITIES } from "../../../config/urls";

const resourceSchema = z.object({
  title: z
    .string({ required_error: "Le titre est requis." })
    .regex(regexGeneric, {
      message: "Le titre contient des caractères non autorisés.",
    }),
  description: z
    .string({ required_error: "La description est requise." })
    .regex(regexGeneric, {
      message: "La description contient des caractères non autorisés.",
    }),
});

type State = {
  activityType: "text" | "video" | "image" | "resource" | null;
  activityState: "read" | "write" | "edit";
  mode: "create" | "update";
  resourceId: number | null;
  file: File | null;
  tags: Tag[];
  tagError: boolean;
  showTipTapEditor: boolean;
  resource: Resource | null;
  activityToDelete: Activity | null;
  previewActivity: Activity | null;
  activitiesActionsDisabled: boolean;
};

type Action =
  | { type: "SET_ACTIVITY_TYPE"; payload: "text" | "video" | "image" | "file" }
  | { type: "CLOSE_TEXT_EDITOR" }
  | { type: "SET_ACTIVITY_STATE"; payload: "read" | "write" | "edit" }
  | { type: "SET_MODE"; payload: "create" | "update" }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_TAGS"; payload: Tag[] }
  | { type: "SET_TAG_ERROR"; payload: boolean }
  | { type: "TOGGLE_TIPTAP_EDITOR" }
  | { type: "SET_RESOURCE"; payload: Resource | null }
  | { type: "SET_ACTIVITY_TO_DELETE"; payload: Activity | null }
  | { type: "SET_PREVIEW_ACTIVITY"; payload: Activity | null };

const initialState: State = {
  activityType: null,
  activityState: "read",
  mode: "create",
  resourceId: null,
  file: null,
  tags: [],
  tagError: false,
  showTipTapEditor: false,
  resource: null,
  activityToDelete: null,
  previewActivity: null,
  activitiesActionsDisabled: false,
};

const useResourceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CLOSE_TEXT_EDITOR":
      return {
        ...state,
        showTipTapEditor: false,
        previewActivity: null,
        activitiesActionsDisabled: false,
        activityState: "read",
      };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_FILE":
      return { ...state, file: action.payload };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_TAG_ERROR":
      return { ...state, tagError: action.payload };
    case "TOGGLE_TIPTAP_EDITOR":
      return { ...state, showTipTapEditor: !state.showTipTapEditor };
    case "SET_RESOURCE":
      return { ...state, resource: action.payload };
    case "SET_ACTIVITY_TO_DELETE":
      return { ...state, activityToDelete: action.payload };
    case "SET_PREVIEW_ACTIVITY":
      return {
        ...state,
        previewActivity: action.payload,
        activitiesActionsDisabled: !!action.payload,
      };
    case "SET_ACTIVITY_STATE":
      return { ...state, activityState: action.payload };
    case "SET_ACTIVITY_TYPE":
      return { ...state, activityType: action.payload };
    default:
      return state;
  }
};

const useResource = () => {
  const { resourceId } = useParams();
  const [state, dispatch] = useReducer(useResourceReducer, initialState);
  const { error, isLoading, sendRequest } = useHttp();
  const { errors, onChangeValue, onValidateForm, values, initValues } = useForm(
    {},
    resourceSchema
  );

  const {
    createActivity,
    editActivityContent,
    content,
    title,
    setTitle,
    resetActivityDatas,
    //resetStorage,
  } = useTextActivity();

  // Form data object combining values, change handler, and errors
  const data = { values, onChangeValue, errors };

  const createNewActivity = (type: "text" | "video" | "image" | "file") => {
    dispatch({ type: "SET_ACTIVITY_TYPE", payload: type });
    dispatch({ type: "SET_ACTIVITY_STATE", payload: "write" });
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onValidateForm()) return;
    const formData = new FormData();
    const resourceData = {
      ...data.values,
      tags: state.tags.map((tag) => tag.name),
    };
    formData.append("data", JSON.stringify(resourceData));
    if (state.file) formData.append("image", state.file);

    const applyData = (data: {
      success: boolean;
      message: string;
      resource: Resource;
    }) => {
      if (data.success) {
        toast.success(data.message);
        dispatch({
          type: "SET_RESOURCE",
          payload: { ...data.resource, activities: [] },
        });
      }
      dispatch({ type: "SET_TAG_ERROR", payload: false });
    };
    sendRequest(
      {
        path: `/resources${resourceId ? `/${resourceId}` : ""}`,
        method: state.mode === "update" ? "put" : "post",
        body: formData,
      },
      applyData
    );
  };

  const handleDeleteActivity = () => {
    if (!state.activityToDelete) return;
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        // Remove the deleted activity from the resource state
        if (state.resource) {
          const updatedActivities = state.resource.activities.filter(
            (activity) => activity.id !== state.activityToDelete!.id
          );
          dispatch({
            type: "SET_RESOURCE",
            payload: { ...state.resource, activities: updatedActivities },
          });
        }
        dispatch({ type: "SET_ACTIVITY_TO_DELETE", payload: null });
      }
    };
    sendRequest(
      {
        path: `/activity/${state.activityToDelete!.type}/${
          state.activityToDelete!.id
        }/resource`,
        method: "delete",
      },
      applyData
    );
  };

  const setFile = (file: File | null) => {
    dispatch({ type: "SET_FILE", payload: file });
  };

  const setTags = (tags: Tag[]) => {
    dispatch({ type: "SET_TAGS", payload: tags });
  };

  const setTagError = (error: boolean) => {
    dispatch({ type: "SET_TAG_ERROR", payload: error });
  };

  const toggleTipTapEditor = () => {
    dispatch({ type: "TOGGLE_TIPTAP_EDITOR" });
  };

  const setResource = (resource: Resource | null) => {
    dispatch({ type: "SET_RESOURCE", payload: resource });
  };

  const setActivityToDelete = (activity: Activity | null) => {
    dispatch({ type: "SET_ACTIVITY_TO_DELETE", payload: activity });
  };

  const setPreviewActivity = (activity: Activity | null) => {
    console.log({ activity });

    dispatch({ type: "SET_PREVIEW_ACTIVITY", payload: activity });
    if (activity && activity.type === "text") {
      dispatch({ type: "TOGGLE_TIPTAP_EDITOR" });
    }
    if (!activity && state.showTipTapEditor)
      dispatch({ type: "TOGGLE_TIPTAP_EDITOR" });

    if (activity && activity.type !== "text") {
      console.log("yes");
    }
  };

  const getResourceDetails = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      resourceDetails: Resource;
    }) => {
      dispatch({ type: "SET_RESOURCE", payload: data.resourceDetails });
      dispatch({ type: "SET_TAGS", payload: data.resourceDetails.tags ?? [] });
      initValues(data.resourceDetails);
    };
    sendRequest({ path: `/resources/${resourceId}`, method: "get" }, applyData);
  }, [sendRequest, resourceId, initValues]);

  /*
  const setActivityState = (state: "read" | "write") => {
    dispatch({ type: "SET_ACTIVITY_STATE", payload: state });
  };
  */

  const getActivityContent = useCallback(() => {
    fetch(`${ACTIVITIES}${state.previewActivity!.url}`).then((response) =>
      response.text().then((content) => {
        editActivityContent(content);
        setTitle(state.previewActivity!.title!);
      })
    );
  }, [editActivityContent, setTitle, state.previewActivity]);

  const handleCloseTextEditor = () => {
    dispatch({ type: "CLOSE_TEXT_EDITOR" });
    resetActivityDatas();

    //resetStorage(resourceId ? parseInt(resourceId) : 0);
  };

  const updateActivities = async (
    id: number,
    title: string,
    content: string,
    isEditing: "read" | "write" | "edit"
  ) => {
    const result = await createActivity(
      isEditing === "write" ? +resourceId! : id,
      title,
      content,
      isEditing
    );
    if (!result)
      toast.error(
        "Une erreur est survenue lors de la mise à jour de l'activité."
      );
    else toast.success("L'activité a été mise à jour avec succès.");
    getResourceDetails();
    return result;
  };

  const newActivity = () => {
    dispatch({ type: "SET_PREVIEW_ACTIVITY", payload: null });
    dispatch({ type: "SET_ACTIVITY_STATE", payload: "write" });
    dispatch({ type: "TOGGLE_TIPTAP_EDITOR" });
    resetActivityDatas();
    getResourceDetails();
  };

  const setActivityState = (state: "read" | "write" | "edit") => {
    dispatch({ type: "SET_ACTIVITY_STATE", payload: state });
  };

  useEffect(() => {
    if (state.previewActivity && state.previewActivity.type === "text") {
      dispatch({ type: "SET_ACTIVITY_STATE", payload: "edit" });
      getActivityContent();
    }
  }, [getActivityContent, state.previewActivity]);

  useEffect(() => {
    if (resourceId) {
      dispatch({ type: "SET_MODE", payload: "update" });
      getResourceDetails();
    } else dispatch({ type: "SET_MODE", payload: "create" });
  }, [getResourceDetails, resourceId]);

  return {
    ...state,
    content,
    createActivity,
    createNewActivity,
    data,
    editActivityContent,
    error,
    handleCloseTextEditor,
    handleDeleteActivity,
    handleSubmitForm,
    isLoading,
    newActivity,
    resourceId,
    setActivityToDelete,
    setFile,
    setPreviewActivity,
    setResource,
    setTagError,
    setTags,
    setTitle,
    title,
    toggleTipTapEditor,
    updateActivities,
    setActivityState,
  };
};

export default useResource;
