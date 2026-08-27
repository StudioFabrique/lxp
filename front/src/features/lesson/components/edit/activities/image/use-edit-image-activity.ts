import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { lessonApi } from "../../../../api/lesson.api";
import { useParams } from "react-router";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import { regexGeneric } from "../../../../../../config/constantes";
import { z } from "zod";
import toast from "react-hot-toast";
import type SuccessWithMessage from "../../../../../../../src/utils/interfaces/success-with-message";

const imageActivitySchema = z.object({
  title: z
    .string()
    .min(1, "A title is required")
    .regex(regexGeneric, {
      message: "The title contains unauthorized characters",
    }),
  description: z.string().optional(),
});

type ImageActivityFormData = z.infer<typeof imageActivitySchema> & {
  url?: string;
};

const useEditImageActivity = (
  activity: Activity | undefined,
  onCancel: (value: boolean) => void,
  parent: "lesson" | "resource",
  onSubmit?: (fd: FormData) => void,
  parentId?: number,
  onSaved?: () => void | Promise<void>,
) => {
  const {
    register,
    watch,
    handleSubmit: rhfHandleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<ImageActivityFormData>({
    resolver: zodResolver(imageActivitySchema),
    defaultValues: { title: "", description: "" },
  });

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { lessonId, resourceId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = rhfHandleSubmit((formValues) => {
    if (!activity && !file && !selectedImage) {
      toast.error("A file is required");
      return;
    }
    const dataToSend: Record<string, unknown> = { ...formValues };
    if (!file && selectedImage) {
      dataToSend.url = selectedImage;
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(dataToSend));
    if (file) {
      formData.append("image", file);
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
      lessonApi.mutations
        .upsertImageActivity(id, parent, formData, activity ? "put" : "post")
        .then(async (data: SuccessWithMessage) => {
          if (data.success) {
            toast.success(data.message);
            if (onSaved) await onSaved();
            else onCancel(false);
          }
        })
        .catch((err: any) => {
          setError(
            err.response?.data?.message ||
              err.message ||
              "Une erreur est survenue"
          );
        })
        .finally(() => setIsLoading(false));
    }
  });

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageString = reader.result as string;
        setImage(imageString);
        setSelectedImage(null);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  useEffect(() => {
    if (activity) {
      setValue("title", activity.title ?? "");
      setValue("description", activity.description ?? "");
    }
  }, [activity, setValue]);

  useEffect(() => {
    const ecouteur = new BroadcastChannel("clipboardChannel");

    const handleMessage = (event: MessageEvent) => {
      setSelectedImage(event.data);
      setFile(null);
      setImage(null);
      setShowDialog(false);
    };
    ecouteur.addEventListener("message", handleMessage);
    return () => ecouteur.close();
  }, []);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return {
    register,
    watch,
    handleSubmit,
    errors,
    setValue,
    image,
    setImage,
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
