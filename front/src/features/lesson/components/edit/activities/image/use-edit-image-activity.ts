import { useEffect, useState } from "react";
import useForm from "../../../../../../../src.legacy/components/UI/forms/hooks/use-form";
import useHttp from "../../../../../../../src.legacy/hooks/use-http";
import { useParams } from "react-router";
import type { Activity } from "../../../../../../../src.legacy/utils/interfaces/activity";
import { regexGeneric } from "../../../../../../../src.legacy/utils/constantes";
import { z, ZodError } from "zod";
import { validationErrors } from "../../../../../../../src.legacy/helpers/validate";
import toast from "react-hot-toast";
import type SuccessWithMessage from "../../../../../../../src.legacy/utils/interfaces/success-with-message";

const useEditImageActivity = (
  activity: Activity | undefined,
  onCancel: (value: boolean) => void,
  parent: "lesson" | "resource",
  onSubmit?: (fd: FormData) => void,
) => {
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const data = { values, errors, onChangeValue };

  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { error, isLoading, sendRequest } = useHttp();
  const { lessonId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const imageActivitySchema = z.object({
    title: z
      .string()
      .min(1, "A title is required")
      .regex(regexGeneric, {
        message: "The title contains unauthorized characters",
      }),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      imageActivitySchema.parse(values);
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const errors = validationErrors(error);
        onValidationErrors(errors);
        return;
      }
    }
    if (!activity && !file && !selectedImage) {
      toast.error("A file is required");
      return;
    }
    if (!file && selectedImage) {
      values.url = selectedImage;
    }
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));
    if (file) {
      formData.append("image", file);
    }
    if (onSubmit) onSubmit(formData);
    else {
      const applyData = (data: SuccessWithMessage) => {
        if (data.success) {
          toast.success(data.message);
          onCancel(false);
        }
      };
      sendRequest(
        {
          path: `/activity/image/${activity?.id ?? lessonId}/${parent}`,
          method: activity ? "put" : "post",
          body: formData,
        },
        applyData,
      );
    }
  };

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
      onChangeValue("title", activity.title!);
      onChangeValue("description", activity.description!);
    }
  }, [activity, onChangeValue]);

  useEffect(() => {
    const ecouteur = new BroadcastChannel("clipboardChannel");

    const handleMessage = (event: MessageEvent) => {
      setSelectedImage(event.data);
      setShowDialog(false);
    };
    ecouteur.addEventListener("message", handleMessage);
    return () => ecouteur.close();
  }, []);

  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  return {
    data,
    handleSubmit,
    image,
    setImage,
    file,
    isLoading,
    onResetForm,
    setFile,
    showDialog,
    setShowDialog,
    selectedImage,
    setSelectedImage,
  };
};

export default useEditImageActivity;
