import { useCallback, useEffect, useReducer } from "react";
import { Activity } from "../../../utils/interfaces/activity";
import Resource from "../../../utils/interfaces/resource";
import Tag from "../../../utils/interfaces/tag";
import useHttp from "../../../hooks/use-http";
import useForm from "../../../components/UI/forms/hooks/use-form";
import z from "zod";
import { regexGeneric } from "../../../utils/constantes";
import { useParams } from "react-router";
import toast from "react-hot-toast";

/**
 * Validation schema for resource form
 * Validates title and description fields with regex pattern
 */
const resourceSchema = z.object({
  title: z
    .string({ required_error: "Le titre est requis." })
    .regex(regexGeneric, {
      message: "Le titre contient des caractères non autorisés.",
    }),
  description: z
    .string()
    .regex(regexGeneric, {
      message: "La description contient des caractères non autorisés.",
    })
    .optional(),
});

/**
 * State type for the resource reducer
 * Manages resource creation/edition and its activities
 */
type State = {
  activityType: "text" | "video" | "image" | "resource" | "iframe" | null; // Current activity type being worked on
  activityState: "read" | "write" | "edit"; // Current state of activity editor
  mode: "create" | "update"; // Resource creation or update mode
  resourceId: number | null; // ID of the resource being edited
  file: File | null; // Uploaded file for resource thumbnail
  tags: Tag[]; // Tags associated with the resource
  tagError: boolean; // Tag validation error flag
  resource: Resource | null; // Current resource data
  activityToDelete: Activity | null; // Activity pending deletion
  previewActivity: Activity | null; // Activity being previewed or edited
  activitiesActionsDisabled: boolean; // Flag to disable activity actions during operations
};

/**
 * Action types for the resource reducer
 * Uses composite actions to minimize re-renders
 */
type Action =
  | { type: "RESET_ACTIVITY_EDITOR" }
  | {
      type: "OPEN_ACTIVITY_EDITOR";
      payload: "text" | "video" | "image" | "resource" | "iframe";
    }
  | {
      type: "OPEN_ACTIVITY";
      payload: { activity: Activity | null; mode: "read" | "write" | "edit" };
    }
  | {
      type: "RESOURCE_CREATED";
      payload: { resource: Resource; resourceId: number };
    }
  | {
      type: "RESOURCE_LOADED";
      payload: { resource: Resource; tags: Tag[] };
    }
  | {
      type: "ACTIVITY_DELETED";
      payload: { updatedActivities: Activity[] };
    }
  | {
      type: "INIT_UPDATE_MODE";
      payload: string;
    }
  | { type: "SET_ACTIVITY_STATE"; payload: "read" | "write" | "edit" }
  | { type: "SET_MODE"; payload: "create" | "update" }
  | { type: "SET_FILE"; payload: File | null }
  | { type: "SET_TAGS"; payload: Tag[] }
  | { type: "SET_TAG_ERROR"; payload: boolean }
  | { type: "SET_RESOURCE"; payload: Resource | null }
  | { type: "SET_ACTIVITY_TO_DELETE"; payload: Activity | null };

/**
 * Initial state for the resource reducer
 */
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

/**
 * Reducer function for managing resource and activity state
 * Uses composite actions to minimize re-renders
 */
const useResourceReducer = (state: State, action: Action): State => {
  switch (action.type) {
    // Composite: Initialize update mode with resourceId from URL
    case "INIT_UPDATE_MODE":
      return {
        ...state,
        mode: "update",
        resourceId: +action.payload,
      };

    // Composite: Resource created - set resource, id, and clear tag error
    case "RESOURCE_CREATED":
      return {
        ...state,
        resource: { ...action.payload.resource, activities: [] },
        resourceId: action.payload.resourceId,
        tagError: false,
      };

    // Composite: Resource loaded from API - set resource and tags
    case "RESOURCE_LOADED":
      return {
        ...state,
        resource: action.payload.resource,
        tags: action.payload.tags,
      };

    // Composite: Activity deleted - update activities, clear deletion state, reset editor
    case "ACTIVITY_DELETED":
      return {
        ...state,
        resource: state.resource
          ? { ...state.resource, activities: action.payload.updatedActivities }
          : null,
        activityToDelete: null,
        previewActivity: null,
        activitiesActionsDisabled: false,
        activityState: "read",
        activityType: null,
      };

    // Composite: Reset the activity editor to initial state
    case "RESET_ACTIVITY_EDITOR":
      return {
        ...state,
        previewActivity: null,
        activitiesActionsDisabled: false,
        activityState: "read",
        activityType: null,
      };

    // Composite: Open activity editor for creating new activity
    case "OPEN_ACTIVITY_EDITOR":
      return {
        ...state,
        activityType: action.payload,
        activityState: "write",
      };

    // Composite: Open activity for preview or edit
    case "OPEN_ACTIVITY":
      return {
        ...state,
        previewActivity: action.payload.activity,
        activitiesActionsDisabled: !!action.payload.activity,
        activityType: action.payload.activity
          ? action.payload.activity.type
          : null,
        activityState: action.payload.mode,
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

    case "SET_ACTIVITY_STATE":
      return { ...state, activityState: action.payload };

    default:
      return state;
  }
};

/**
 * Custom hook for managing resource creation/edition and its activities
 * Handles form validation, file uploads, activity CRUD operations
 *
 * @returns Object containing state, handlers, and utility functions
 */
const useResource = () => {
  const { resourceId } = useParams();
  const [state, dispatch] = useReducer(useResourceReducer, initialState);
  const { error, isLoading, sendRequest } = useHttp(true);
  const { errors, onChangeValue, onValidateForm, values, initValues } = useForm(
    {},
    resourceSchema,
  );

  // Form data object combining values, change handler, and errors
  const data = { values, onChangeValue, errors };

  /**
   * Opens the activity editor to create a new activity of specified type
   * @param type - Type of activity to create
   */
  const createNewActivity = (
    type: "text" | "video" | "image" | "resource" | "iframe",
  ) => {
    // Single composite action instead of 2 dispatches
    dispatch({ type: "OPEN_ACTIVITY_EDITOR", payload: type });
  };

  /**
   * Handles resource form submission (create or update)
   * Validates form, prepares FormData with file and tags, and sends request
   */
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
          type: "RESOURCE_CREATED",
          payload: { resource: data.resource, resourceId: data.resource.id },
        });
      } else {
        dispatch({ type: "SET_TAG_ERROR", payload: false });
      }
    };

    sendRequest(
      {
        path: `/resources${state.mode === "update" ? `/${state.resourceId}` : ""}`,
        method: state.mode === "update" ? "put" : "post",
        body: formData,
      },
      applyData,
    );
  };

  /**
   * Deletes the activity marked for deletion
   * Updates the resource state by removing the deleted activity
   */
  const handleDeleteActivity = () => {
    if (!state.activityToDelete) return;
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        const updatedActivities =
          state.resource?.activities.filter(
            (activity) => activity.id !== state.activityToDelete!.id,
          ) ?? [];
        dispatch({
          type: "ACTIVITY_DELETED",
          payload: { updatedActivities },
        });
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

  /** Sets the uploaded file for resource thumbnail */
  const setFile = (file: File | null) => {
    dispatch({ type: "SET_FILE", payload: file });
  };

  /** Updates the tags associated with the resource */
  const setTags = (tags: Tag[]) => {
    dispatch({ type: "SET_TAGS", payload: tags });
  };

  /** Sets tag validation error state */
  const setTagError = (error: boolean) => {
    dispatch({ type: "SET_TAG_ERROR", payload: error });
  };

  /** Updates the current resource data */
  const setResource = (resource: Resource | null) => {
    dispatch({ type: "SET_RESOURCE", payload: resource });
  };

  /** Marks an activity for deletion */
  const setActivityToDelete = (activity: Activity | null) => {
    dispatch({ type: "SET_ACTIVITY_TO_DELETE", payload: activity });
  };

  /** Opens an activity in preview mode */
  const setPreviewActivity = (activity: Activity | null) => {
    // Single composite action instead of separate logic
    dispatch({ type: "OPEN_ACTIVITY", payload: { activity, mode: "read" } });
  };

  /** Opens an activity in edit mode */
  const setEditActivity = (activity: Activity | null) => {
    // Single composite action instead of separate logic
    dispatch({ type: "OPEN_ACTIVITY", payload: { activity, mode: "edit" } });
  };

  /**
   * Fetches resource details from the API
   * Updates state with resource data, tags, and initializes form values
   */
  const getResourceDetails = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      resourceDetails: Resource;
    }) => {
      dispatch({
        type: "RESOURCE_LOADED",
        payload: {
          resource: data.resourceDetails,
          tags: data.resourceDetails.tags ?? [],
        },
      });
      initValues(data.resourceDetails);
    };
    if (state.resourceId) {
      sendRequest(
        { path: `/resources/${state.resourceId}`, method: "get" },
        applyData,
      );
    }
  }, [sendRequest, state.resourceId, initValues]);

  /** Closes the text editor and resets to initial state */
  const handleCloseTextEditor = () => {
    // Using the unified reset action
    dispatch({ type: "RESET_ACTIVITY_EDITOR" });
  };

  /**
   * Prepares to create a new activity after previous operation
   * Refreshes resource data from server
   */
  const newActivity = () => {
    // Single composite action + state update instead of 2 dispatches
    dispatch({
      type: "OPEN_ACTIVITY",
      payload: { activity: null, mode: "write" },
    });
    getResourceDetails();
  };

  /** Sets the current state of the activity editor */
  const setActivityState = (state: "read" | "write" | "edit") => {
    dispatch({ type: "SET_ACTIVITY_STATE", payload: state });
  };

  /**
   * Displays success message and refreshes activity list
   * @param message - Success message to display
   */
  const refreshActivityList = (message: string) => {
    toast.success(message);
    getResourceDetails();
  };

  /**
   * Uploads or updates a video activity
   * @param fd - FormData containing video file and metadata
   */
  const uploadVideo = (fd: FormData) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
      }
      // Single composite action instead of 2 dispatches
      dispatch({ type: "RESET_ACTIVITY_EDITOR" });
      getResourceDetails();
    };
    sendRequest(
      {
        path: `/activity/video/${state.previewActivity?.id ?? state.resourceId}`,
        method: state.previewActivity ? "put" : "post",
        body: fd,
      },
      applyData,
    );
  };

  /**
   * Closes activity preview and refreshes resource data
   */
  const closePreviewActivity = () => {
    // Using the unified reset action
    dispatch({ type: "RESET_ACTIVITY_EDITOR" });
    getResourceDetails();
  };

  /**
   * Callback after activity submission
   * Refreshes the activity list
   */
  const resourceActivityiesSubmitted = () => {
    getResourceDetails();
  };

  /**
   * Creates or updates an iframe activity
   * @param newActivity - Object containing title and URL for the iframe
   */
  const submitIframeActivity = (newActivity: {
    title: string;
    url: string;
  }) => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
      }
      getResourceDetails();
      // Using the unified reset action
      dispatch({ type: "RESET_ACTIVITY_EDITOR" });
    };
    sendRequest(
      {
        path: `/activity/iframe/${state.previewActivity?.id ?? state.resourceId}`,
        method: state.previewActivity ? "put" : "post",
        body: {
          title: newActivity.title,
          url: newActivity.url,
          parent: "resource",
        },
      },
      applyData,
    );
  };

  /**
   * Determines create/update mode based on resourceId parameter
   * Fetches resource details if updating existing resource
   */
  useEffect(() => {
    if (resourceId !== undefined && resourceId !== null) {
      dispatch({ type: "INIT_UPDATE_MODE", payload: resourceId });
      getResourceDetails();
    } else {
      dispatch({ type: "SET_MODE", payload: "create" });
    }
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
    submitIframeActivity,
  };
};

export default useResource;
