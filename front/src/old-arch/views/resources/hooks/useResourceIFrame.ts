import { useEffect, useMemo, useState } from "react";
import { Activity } from "../../../utils/interfaces/activity";
import z from "zod";
import { regexGeneric } from "../../../utils/constantes";
import useForm from "../../../components/UI/forms/hooks/use-form";
import cleanIframeLink from "../../../utils/clean-iframe-link";
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
      .string({ required_error: "Le titre est requis" })
      .regex(regexGeneric, {
        message: "Le titre contient des caractères non autorisés",
      }),
  });

  // Form hook provides values, change handlers, validation, and errors
  const { values, onChangeValue, initValues, onValidateForm, errors } = useForm(
    {},
    schema,
  );

  // Organize form data for Field component consumption
  const data = { values, onChangeValue, errors };

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form fields with Zod schema
    const isValid = onValidateForm();
    if (!isValid) {
      toast.error("Formulaire invalide");
      return;
    }

    // Validate URL presence
    if (!cleanedUrl) {
      setUrlError("L'URL n'est pas valide");
      return;
    }

    // Submit with type assertion (safe due to Zod validation)
    onSubmit({ title: data.values.title as string, url: cleanedUrl });
  };

  // Effect to initialize form values when activity prop changes
  useEffect(() => {
    if (activity) {
      initValues({ title: activity.title });
      setSrc(activity.url);
    }
  }, [activity, initValues]);

  return {
    data,
    cleanedUrl,
    handleUrlChange,
    handleSubmit,
    src,
    urlError,
    isLoading,
    setIsLoading,
  };
};
export default useResourceIFrame;
