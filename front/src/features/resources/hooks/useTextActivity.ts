import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { textActivitySchema } from "../text-activity.schema";
import { useFormField } from "../../../components/form/useFormField";
import { showFormErrors } from "../../../components/form/form-errors";

import { useCallback, useEffect, useState } from "react";
import { resourcesApi } from "../api/resources.api";
import toast from "react-hot-toast";
import { ACTIVITIES } from "../../../config/urls";
import { Activity } from "../../../utils/interfaces/activity";

const useTextActivity = () => {
  const form = useForm({
    resolver: zodResolver(textActivitySchema),
    defaultValues: { title: "", content: "" },
  });
  const [title, setTitle] = useFormField(form, "title");
  const [content, setContent] = useFormField(form, "content");
  const [error, setError] = useState<string>("");

  const createActivity = async (
    id?: number,
    title?: string,
    content?: string,
    mode: "read" | "write" | "edit" = "write",
  ): Promise<boolean> => {
    // Implementation for creating an activity
    if (!id) return false;
    form.setValue("title", title ?? form.getValues("title"));
    form.setValue("content", content ?? form.getValues("content"));
    if (!(await form.trigger())) {
      showFormErrors(form.formState.errors);
      return false;
    }
    const values = textActivitySchema.parse(form.getValues());

    const body = {
      title: values.title,
      description: "",
      value: values.content,
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

  const editActivityContent = useCallback(
    (newContent: string) => {
      setContent(newContent);
    },
    [setContent],
  );

  const deleteActivity = () => {
    // Implementation for deleting an activity
  };

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
        }),
      );
    },
    [editActivityContent, setTitle],
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
    resetActivityDatas,
    resetStorage,
    getActivityContent,
  };
};

export default useTextActivity;
