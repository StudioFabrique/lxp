import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Activity } from "../../../utils/interfaces/activity";
import z from "zod";
import { regexGeneric } from "../../../config/constantes";
import cleanIframeLink from "../../../utils/helpers/clean-iframe-link";
import toast from "react-hot-toast";

const useResourceIFrame = (
  activity: Activity | null,
  onSubmit: (newActivity: { title: string; url: string }) => void,
) => {
  // State for iframe source URL, initialized from existing activity if available
  const [src, setSrc] = useState<string | null>(activity?.url ?? null);
  // State for URL validation errors
  const [urlError, setUrlError] = useState<string | null>(null);
  // State to track iframe loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoized Zod validation schema for the title field
  const schema = z.object({
    title: z
      .string({ error: "Le titre est requis" })
      .regex(regexGeneric, {
        message: "Le titre contient des caractères non autorisés",
      }),
  });

  // React Hook Form provides register, validation, and errors
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { title: activity?.title ?? "" },
  });

  // Memoized cleaned and validated URL
  // Automatically cleans the URL when src changes
  const cleanedUrl = useMemo(() => {
    try {
      setUrlError(null);
      return src && src.length > 0 ? cleanIframeLink(src) : "";
    } catch (error) {
      setUrlError((error as Error).message);
      return "";
    }
  }, [src]);

  /**
   * Handles URL input field changes
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSrc(e.target.value);
  };

  /**
   * Handles form submission
   * Validates URL and form data before calling onSubmit callback
   */
  const submitForm = (data: { title: string }) => {
    // Validate URL presence
    if (!cleanedUrl) {
      setUrlError("L'URL n'est pas valide");
      return;
    }

    // Submit with type assertion (safe due to Zod validation)
    onSubmit({ title: data.title, url: cleanedUrl });
  };

  const handleSubmitForm = handleSubmit(
    submitForm,
    () => toast.error("Formulaire invalide"),
  );

  // Effect to initialize form values when activity prop changes
  useEffect(() => {
    if (activity) {
      setValue("title", activity.title ?? "");
      setSrc(activity.url);
    }
  }, [activity, setValue]);

  return {
    data: { register, errors },
    cleanedUrl,
    handleUrlChange,
    handleSubmit: handleSubmitForm,
    src,
    urlError,
    isLoading,
    setIsLoading,
  };
};
export default useResourceIFrame;
