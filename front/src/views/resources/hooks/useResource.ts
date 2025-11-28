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
  activityType: "text" | "video" | "image" | "resource" | "iframe" | null;
  activityState: "read" | "write" | "edit";
  mode: "create" | "update";
  resourceId: number | null;
  file: File | null;
  tags: Tag[];
  tagError: boolean;
  resource: Resource | null;
  activityToDelete: Activity | null;
  previewActivity: Activity | null;
  activitiesActionsDisabled: boolean;
};

type Action =
  | { type: "CLOSE_PREVIEW_ACTIVITY" }
  | {
      type: "SET_ACTIVITY_TYPE";
      payload: "text" | "video" | "image" | "resource";
    }
  | { type: "CLOSE_TEXT_EDITOR" }
  | { type: "SET_ACTIVITY_STATE"; payload: "read" | "write" | "edit" }
  | { type: "SET_MODE"; payload: "create" | "update" }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_TAGS"; payload: Tag[] }
  | { type: "SET_TAG_ERROR"; payload: boolean }
  | { type: "SET_RESOURCE"; payload: Resource | null }
  | { type: "SET_ACTIVITY_TO_DELETE"; payload: Activity | null }
  | { type: "SET_PREVIEW_ACTIVITY"; payload: Activity | null }
  | { type: "SET_EDIT_ACTIVITY"; payload: Activity | null };

const initialState: State = {
  activityType: null,
  activityState: "read",
  mode: "create",
  resourceId: null,
  file: null,
  tags: [],
  tagError: false,
  resource: null,
  activityToDelete: null,
  previewActivity: null,
  activitiesActionsDisabled: false,
};

const useResourceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "CLOSE_PREVIEW_ACTIVITY":
      return {
        ...state,
        previewActivity: null,
        activitiesActionsDisabled: false,
        activityState: "read",
        activityType: null,
      };
    case "CLOSE_TEXT_EDITOR":
      return {
        ...state,
        previewActivity: null,
        activitiesActionsDisabled: false,
        activityState: "read",
        activityType: null,
      };
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "SET_FILE":
      return { ...state, file: action.payload };
    case "SET_TAGS":
      return { ...state, tags: action.payload };
    case "SET_TAG_ERROR":
      return { ...state, tagError: action.payload };
    case "SET_RESOURCE":
      return { ...state, resource: action.payload };
    case "SET_ACTIVITY_TO_DELETE":
      return { ...state, activityToDelete: action.payload };
    case "SET_PREVIEW_ACTIVITY":
      return {
        ...state,
        previewActivity: action.payload,
        activitiesActionsDisabled: !!action.payload,
        activityType: action.payload ? action.payload.type : null,
        activityState: "read",
      };
    case "SET_ACTIVITY_STATE":
      return { ...state, activityState: action.payload };
    case "SET_ACTIVITY_TYPE":
      return { ...state, activityType: action.payload };
    case "SET_EDIT_ACTIVITY":
      return {
        ...state,
        previewActivity: action.payload,
        activitiesActionsDisabled: !!action.payload,
        activityType: action.payload ? action.payload.type : null,
        activityState: "edit",
      };
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
    resourceSchema,
  );

  console.log("STATE", state.activityState);

  // Form data object combining values, change handler, and errors
  const data = { values, onChangeValue, errors };

  const createNewActivity = (type: "text" | "video" | "image" | "resource") => {
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
      applyData,
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
            (activity) => activity.id !== state.activityToDelete!.id,
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
      applyData,
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

  const setResource = (resource: Resource | null) => {
    dispatch({ type: "SET_RESOURCE", payload: resource });
  };

  const setActivityToDelete = (activity: Activity | null) => {
    dispatch({ type: "SET_ACTIVITY_TO_DELETE", payload: activity });
  };

  const setPreviewActivity = (activity: Activity | null) => {
    dispatch({ type: "SET_PREVIEW_ACTIVITY", payload: activity });
  };

  const setEditActivity = (activity: Activity | null) => {
    dispatch({ type: "SET_EDIT_ACTIVITY", payload: activity });
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

  const handleCloseTextEditor = () => {
    dispatch({ type: "CLOSE_TEXT_EDITOR" });
  };

  const newActivity = () => {
    dispatch({ type: "SET_PREVIEW_ACTIVITY", payload: null });
    dispatch({ type: "SET_ACTIVITY_STATE", payload: "write" });
    getResourceDetails();
  };

  const setActivityState = (state: "read" | "write" | "edit") => {
    dispatch({ type: "SET_ACTIVITY_STATE", payload: state });
  };

  const refreshActivityList = (message: string) => {
    toast.success(message);
    getResourceDetails();
  };

  const uploadVideo = (fd: FormData) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
      }
      dispatch({ type: "SET_PREVIEW_ACTIVITY", payload: null });
      dispatch({ type: "SET_ACTIVITY_STATE", payload: "read" });
      getResourceDetails();
    };
    sendRequest(
      {
        path: `/activity/video/${state.previewActivity?.id ?? resourceId}`,
        method: state.previewActivity ? "put" : "post", // PUT si modification, POST si création
        body: fd,
      },
      applyData,
    );
  };

  const closePreviewActivity = () => {
    dispatch({ type: "CLOSE_PREVIEW_ACTIVITY" });
  };

  const resourceActivityiesSubmitted = () => {
    getResourceDetails();
  };

  useEffect(() => {
    if (resourceId) {
      dispatch({ type: "SET_MODE", payload: "update" });
      getResourceDetails();
    } else dispatch({ type: "SET_MODE", payload: "create" });
  }, [getResourceDetails, resourceId]);

  return {
    ...state,
    closePreviewActivity,
    createNewActivity,
    data,
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
    setActivityState,
    setEditActivity,
    refreshActivityList,
    uploadVideo,
    resourceActivityiesSubmitted,
  };
};

export default useResource;
