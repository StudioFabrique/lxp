import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonApi } from "../../../../api/lesson.api";
import { useParams } from "react-router";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import { imageSchema, type ImageFormValues } from "../../../../media.schema";
import { useFormField } from "../../../../../../components/form/useFormField";
import { showFormErrors } from "../../../../../../components/form/form-errors";
import { getApiErrorMessage } from "../../../../../../utils/helpers/api-error-message";
import toast from "react-hot-toast";
import type SuccessWithMessage from "../../../../../../../src/utils/interfaces/success-with-message";

const useEditImageActivity = (
  activity: Activity | undefined,
  onCancel: (value: boolean) => void,
  parent: "lesson" | "resource",
  onSubmit?: (fd: FormData) => void,
  parentId?: number,
  onSaved?: () => void | Promise<void>,
) => {
  const form = useForm<ImageFormValues>({ resolver: zodResolver(imageSchema), defaultValues: { title: activity?.title ?? "", description: activity?.description ?? "", file: null, selectedImage: activity?.url ?? null } });
  const {
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = form;

  const [file, setFile] = useFormField(form, "file");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const { lessonId, resourceId } = useParams();
  const [selectedImage, setSelectedImage] = useFormField(form, "selectedImage");

  const handleSubmit = rhfHandleSubmit(async (formValues) => {
    if (isLoading) return;
    const dataToSend = { title: formValues.title, description: formValues.description, ...(!formValues.file && formValues.selectedImage ? { url: formValues.selectedImage } : {}) };
    const formData = new FormData();
    formData.append("data", JSON.stringify(dataToSend));
    if (formValues.file) {
      formData.append("image", formValues.file);
    }
    if (onSubmit) onSubmit(formData);
    else {
      setIsLoading(true);
      const routeParentId = parent === "resource" ? resourceId : lessonId;
      const id = activity?.id ?? parentId ?? routeParentId;
      if (id === undefined) {
        setIsLoading(false);
        toast.error("Impossible d'identifier le parent de l'image.");
        return;
      }
      await lessonApi.mutations
        .upsertImageActivity(id, parent, formData, activity ? "put" : "post")
        .then(async (data: SuccessWithMessage) => {
          if (data.success) {
            toast.success(data.message);
            if (onSaved) await onSaved();
            else onCancel(false);
          }
        })
        .catch((err: unknown) => toast.error(getApiErrorMessage(err, "Une erreur est survenue")))
        .finally(() => setIsLoading(false));
    }
  }, showFormErrors);

  useEffect(() => {
    reset({ title: activity?.title ?? "", description: activity?.description ?? "", file: null, selectedImage: activity?.url ?? null });
  }, [activity, reset]);

  useEffect(() => {
    const ecouteur = new BroadcastChannel("clipboardChannel");

    const handleMessage = (event: MessageEvent) => {
      if (typeof event.data !== "string") return;
      setSelectedImage(event.data);
      setFile(null);
      setShowDialog(false);
    };
    ecouteur.addEventListener("message", handleMessage);
    return () => ecouteur.close();
  }, [setSelectedImage, setFile]);

  return {
    register,
    watch,
    handleSubmit,
    errors,
    setValue,
    file,
    isLoading,
    reset,
    setFile,
    showDialog,
    setShowDialog,
    selectedImage,
    setSelectedImage,
  };
};

export default useEditImageActivity;
