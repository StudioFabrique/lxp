import { useEffect, useState } from "react";
import useForm from "../../../UI/forms/hooks/use-form";
import useHttp from "../../../../hooks/use-http";
import { useParams } from "react-router-dom";
import type { Activity } from "../../../../utils/interfaces/activity";
import { regexGeneric } from "../../../../utils/constantes";
import { z, ZodError } from "zod";
import { validationErrors } from "../../../../helpers/validate";
import toast from "react-hot-toast";
import type SuccessWithMessage from "../../../../utils/interfaces/success-with-message";

/**
 * Custom hook to manage the editing of an image activity
 * @param activity - The activity to edit (optional)
 * @param onCancel - Callback function called on cancellation
 * @param parent - The parent type of the activity (optional, defaults to "lesson")
 * @returns An object containing the states and functions needed to manage the form
 */
const useEditImageActivity = (
  activity: Activity | undefined,
  onCancel: (value: boolean) => void,
  parent: "lesson" | "resource",
) => {
  // Initialize the form with the useForm hook
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const data = { values, errors, onChangeValue };

  // States for image management
  const [image, setImage] = useState<string | null>(null); // For preview
  const [file, setFile] = useState<File | null>(null); // For uploaded file
  const [showDialog, setShowDialog] = useState<boolean>(false); // For selection modal

  // Hooks for HTTP requests and navigation
  const { error, isLoading, sendRequest } = useHttp();
  const { lessonId } = useParams();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Define validation schema with Zod
  const imageActivitySchema = z.object({
    title: z
      .string({ required_error: "A title is required" })
      .regex(regexGeneric, {
        message: "The title contains unauthorized characters",
      }),
    description: z
      .string({ required_error: "A description is required" })
      .regex(regexGeneric, {
        message: "The description contains unauthorized characters",
      }),
  });

  /**
   * Handles form submission
   * Validates data, prepares FormData and sends the request
   * @param event - The form submission event
   */
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
  };

  /**
   * Effect to handle image preview
   * Converts the file to base64 URL for display
   */
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

  /**
   * Effect to initialize the form with existing data
   * when in edit mode
   */
  useEffect(() => {
    if (activity) {
      onChangeValue("title", activity.title!);
      onChangeValue("description", activity.description!);
    }
  }, [activity, onChangeValue]);

  /**
   * Effect to manage inter-window communication
   * via BroadcastChannel for image selection
   */
  useEffect(() => {
    const ecouteur = new BroadcastChannel("clipboardChannel");

    const handleMessage = (event: MessageEvent) => {
      setSelectedImage(event.data);
      setShowDialog(false);
    };
    ecouteur.addEventListener("message", handleMessage);
    return () => ecouteur.close();
  }, []);

  /**
   * Effect to display errors via toast
   */
  useEffect(() => {
    if (error.length > 0) toast.error(error);
  }, [error]);

  // Return necessary states and functions
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
