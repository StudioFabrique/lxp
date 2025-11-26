/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { regexGeneric } from "../../../utils/constantes";
import toast from "react-hot-toast";
import { ACTIVITIES } from "../../../config/urls";
import { Activity } from "../../../utils/interfaces/activity";

const useTextActivity = (activity?: Activity) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { error, sendRequest } = useHttp();

  const createActivity = async (
    id?: number,
    title?: string,
    content?: string,
    mode: "read" | "write" | "edit" = "write"
  ): Promise<boolean> => {
    // Implementation for creating an activity
    if (!regexGeneric.test(title!)) {
      toast.error("Le titre contient des caractères non autorisés.");
      return false;
    }

    const applyData = (_data: unknown) => {
      return true;
    };
    const response: Promise<boolean> = await sendRequest(
      {
        path: `/activity/text/${id}`,
        method: mode === "edit" ? "put" : "post",
        body: {
          title,
          description: "déception",
          value: content,
          parent: "resource",
        },
      },
      applyData
    );

    return response;
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

  const getActivityContent = useCallback(() => {
    fetch(`${ACTIVITIES}${activity!.url}`).then((response) =>
      response.text().then((content) => {
        editActivityContent(content);
        setTitle(activity!.title!);
      })
    );
  }, [activity, editActivityContent]);

  useEffect(() => {
    if (activity) getActivityContent();
  }, [activity, getActivityContent]);

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
  };
};

export default useTextActivity;
