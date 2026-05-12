import { useCallback, useEffect, useState } from "react";
import useForm from "../../../components/UI/forms/hooks/use-form";
import useHttp from "../../../hooks/use-http";
import toast from "react-hot-toast";
import Tag from "../../../utils/interfaces/tag";
import { regexGeneric } from "../../../utils/constantes";
import z from "zod";
import { Activity } from "../../../utils/interfaces/activity";
import Resource from "../../../utils/interfaces/resource";
import { useParams } from "react-router";
import { ACTIVITIES } from "../../../config/urls";
import useTextActivity from "./useTextActivity";

const schema = z.object({
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

export default function useResource() {
  const { content, title, createActivity, setTitle, editActivityContent } =
    useTextActivity();
  const { resourceId } = useParams();
  const [file, setFile] = useState<File | null>(null);
  const { errors, values, onChangeValue, onValidateForm, initValues } = useForm(
    {},
    schema
  );
  const data = { values, errors, onChangeValue };
  const { sendRequest, isLoading, error } = useHttp();

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagError, setTagError] = useState(false);
  const [showTipTapEditor, setShowTipTapEditor] = useState<boolean>(false);
  const [resource, setResource] = useState<Resource | null>(null);
  const [isAnyActivityBeingEdited, setIsAnyActivityBeingEdited] =
    useState<boolean>(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(
    null
  );
  const [previewActivity, setPreviewActivity] = useState<Activity | null>(null);

  console.log({ previewActivity });

  const handleClickShowTipTapEditor = () => setShowTipTapEditor(true);
  const handleCloseTipTapEditor = () => {
    setShowTipTapEditor(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onValidateForm()) return;
    const formData = new FormData();
    const resourceData = {
      ...data.values,
      tags: tags.map((tag) => tag.name),
    };
    formData.append("data", JSON.stringify(resourceData));
    if (file) formData.append("image", file);

    const applyData = (data: {
      success: boolean;
      message: string;
      resource: Resource;
    }) => {
      if (data.success) {
        toast.success(data.message);
        setResource({ ...data.resource, activities: [] });
      }
      setTagError(false);
    };
    sendRequest(
      {
        path: `/resources${resourceId ? `/${resourceId}` : ""}`,
        method: resourceId ? "put" : "post",
        body: formData,
      },
      applyData
    );
  };

  const handleActivityCreated = (newActivity: Activity) => {
    setResource((prevResource) => {
      if (!prevResource) return prevResource;
      return {
        ...prevResource,
        activities: [...prevResource.activities, newActivity],
      };
    });
    setPreviewActivity(newActivity);
  };

  const handleDeleteActivity = () => {
    const applyData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
        if (resource) {
          setResource((prevResource) => {
            if (!prevResource) return prevResource;
            return {
              ...prevResource,
              bonusActivities: prevResource.activities.filter(
                (a) => a.id !== activityToDelete!.id
              ),
            };
          });
        }
        setActivityToDelete(null);
      }
      setPreviewActivity(
        resource!.activities[resource!.activities.length - 1] ?? null
      );
    };
    sendRequest(
      {
        path: `/activity/${activityToDelete!.type}/${
          activityToDelete!.id
        }/resource`,
        method: "delete",
      },
      applyData
    );
  };

  const getDetails = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      resourceDetails: Resource;
    }) => {
      setResource(data.resourceDetails);
      setTags(data.resourceDetails.tags || []);
      initValues(data.resourceDetails);
    };
    sendRequest({ path: `/resources/${resourceId}`, method: "get" }, applyData);
  }, [sendRequest, resourceId, initValues]);

  useEffect(() => {
    getDetails();
  }, [getDetails]);

  useEffect(() => {
    if (previewActivity && previewActivity.type === "text") {
      fetch(`${ACTIVITIES}${previewActivity.url}`).then((response) =>
        response.text().then((content) => {
          console.log(content);
          editActivityContent(content);
        })
      );
    }
  }, [editActivityContent, previewActivity]);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  console.log({ showTipTapEditor });

  return {
    setTitle,
    createActivity,
    editActivityContent,
    content,
    title,
    file,
    setFile,
    errors,
    values,
    onChangeValue,
    onValidateForm,
    data,
    isLoading,
    tags,
    setTags,
    tagError,
    setTagError,
    showTipTapEditor,
    setShowTipTapEditor,
    resource,
    setResource,
    isAnyActivityBeingEdited,
    setIsAnyActivityBeingEdited,
    handleClickShowTipTapEditor,
    handleCloseTipTapEditor,
    handleSubmitForm,
    handleActivityCreated,
    handleDeleteActivity,
    activityToDelete,
    setActivityToDelete,
    previewActivity,
    setPreviewActivity,
  };
}
