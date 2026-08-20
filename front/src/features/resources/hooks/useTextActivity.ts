 
import { useCallback, useEffect, useState } from "react";
import { resourcesApi } from "../api/resources.api";
import { regexGeneric } from "../../../config/constantes";
import toast from "react-hot-toast";
import { ACTIVITIES } from "../../../config/urls";
import { Activity } from "../../../utils/interfaces/activity";

const useTextActivity = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  const createActivity = async (
    id?: number,
    title?: string,
    content?: string,
    mode: "read" | "write" | "edit" = "write"
  ): Promise<boolean> => {
    // Implementation for creating an activity
    if (!id) return false;
    if (!regexGeneric.test(title!)) {
      toast.error("Le titre contient des caractères non autorisés.");
      return false;
    }

    const body = {
      title,
      description: "déception",
      value: content,
      parent: "resource",
    };

    try {
      if (mode === "edit") {
        await resourcesApi.mutations.saveTextActivity(id, body, true);
      } else {
        await resourcesApi.mutations.saveTextActivity(id, body, false);
      }
      return true;
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Erreur inconnue",
      );
      return false;
    }
  };

  const resetActivityDatas = () => {
    setTitle("");
    setContent("");
  };

  const setActivityTitle = (newTitle: string) => {
    // Implementation for setting activity title
    setTitle(newTitle);
  };

  const editActivityContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const deleteActivity = () => {
    // Implementation for deleting an activity
  };

  const updateActivity = () => {};

  const resetStorage = (id: number) => {
    console.log("ID", id);

    console.log("RESETTING STORAGE");

    // Ensure we have a valid id and that localStorage is available (avoid SSR issues)
    if (id === null || id === undefined) {
      console.warn("resetStorage called without a valid id:", id);
      return;
    }
    if (typeof window === "undefined" || !window.localStorage) {
      console.warn("localStorage is not available in this environment.");
      return;
    }

    const key = `autosave_new_activity_${id}`;
    console.log("Removing localStorage key:", key);
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn("Failed to remove localStorage key:", key, err);
    }
  };

  const getActivityContent = useCallback(
    (activity: Activity) => {
      fetch(`${ACTIVITIES}${activity!.url}`, {
        credentials: "include",
      }).then((response) =>
        response.text().then((content) => {
          editActivityContent(content);
          setTitle(activity!.title!);
        })
      );
    },
    [editActivityContent]
  );

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return {
    setTitle,
    content,
    title,
    createActivity,
    deleteActivity,
    editActivityContent,
    setActivityTitle,
    updateActivity,
    resetActivityDatas,
    resetStorage,
    getActivityContent,
  };
};

export default useTextActivity;
