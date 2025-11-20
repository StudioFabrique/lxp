import { useCallback, useState } from "react";
import useHttp from "../../../hooks/use-http";
import { useParams } from "react-router-dom";
import { regexGeneric } from "../../../utils/constantes";
import toast from "react-hot-toast";

const useTextActivity = () => {
  const params = useParams();
  const [resourceId, setResourceId] = useState<number | null>(
    +params.resourceId! || null
  );
  const [title, setTitle] = useState<string>("toto");
  const [content, setContent] = useState<string>("");
  const [mode, setModeState] = useState<"create" | "edit">("create");
  const { error, isLoading, sendRequest } = useHttp();

  const setMode = (mode: "create" | "edit") => {
    setModeState(mode);
  };

  const getActivityDatas = () => {
    // Implementation for getting activity data
    if (!resourceId) return;
    const applyData = (data: any) => {};
  };

  const createActivity = async (
    id?: number,
    title?: string,
    content?: string
  ): Promise<boolean> => {
    console.log({ title, content });

    // Implementation for creating an activity
    const isActivityValid = regexGeneric.test(title!);
    console.log({ isActivityValid });

    if (!isActivityValid) {
      toast.error(
        "Le titre ou le contenu contient des caractères non autorisés."
      );
      return false;
    }
    const applyData = (data: any) => {
      console.log({ data });
      return true;
    };
    sendRequest(
      {
        path: `/activity/text/${resourceId}`,
        method: "post",
        body: {
          title,
          description: "déception",
          value: content,
          parent: "resource",
        },
      },
      applyData
    );
    return false;
  };

  const setActivityTitle = (newTitle: string) => {
    // Implementation for setting activity title
    setTitle(newTitle);
  };

  const editActivityContent = useCallback((newContent: string) => {
    console.log({ newContent });

    // Implementation for editing activity content
    setContent(newContent);
  }, []);

  const deleteActivity = () => {
    // Implementation for deleting an activity
  };

  const updateActivity = () => {
    // Implementation for updating an activity
  };

  console.log({ title });

  return {
    setTitle,
    content,
    title,
    createActivity,
    deleteActivity,
    editActivityContent,
    getActivityDatas,
    setActivityTitle,
    setMode,
    updateActivity,
  };
};

export default useTextActivity;
