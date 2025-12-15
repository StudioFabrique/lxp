import { useEffect, useMemo, useState } from "react";
import { Activity } from "../../utils/interfaces/activity";
import { ActivitySelectMode } from "../../views/module-content-explorer/store/module-explorer-reducer";
import useForm from "../UI/forms/hooks/use-form";
import Field from "../UI/forms/field";
import z from "zod";
import { regexGeneric } from "../../utils/constantes";
import cleanIframeLink from "../../utils/clean-iframe-link";
import toast from "react-hot-toast";

/**
 * Props for IFrameActivityResource component
 */
type Props = {
  /** Display mode: read, write, or edit */
  mode: ActivitySelectMode;
  /** Existing activity data (null when creating new activity) */
  activity: Activity | null;
  /** Callback triggered when form is submitted with new activity data */
  onSubmit: (newActivity: { title: string; url: string }) => void;
  /** Callback triggered when user cancels the operation */
  onCancel: () => void;
};

/**
 * IFrameActivityResource Component
 *
 * Manages iframe-based activities with form validation and preview.
 * Supports three modes: read (display only), write (create), and edit.
 *
 * Features:
 * - URL validation and cleaning
 * - Real-time iframe preview
 * - Form validation with Zod schema
 * - Loading state for iframe content
 */
export default function IFrameActivityResource(props: Props) {
  // State for iframe source URL, initialized from existing activity if available
  const [src, setSrc] = useState<string | null>(props.activity?.url ?? null);
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

    // Validate URL presence
    if (!cleanedUrl) {
      setUrlError("L'URL n'est pas valide");
      return;
    }

    // Validate form fields with Zod schema
    const isValid = onValidateForm();
    if (!isValid) {
      toast.error("Formulaire invalide");
      return;
    }

    // Submit with type assertion (safe due to Zod validation)
    props.onSubmit({ title: data.values.title as string, url: cleanedUrl });
  };

  // Effect to initialize form values when activity prop changes
  useEffect(() => {
    if (props.activity)
      initValues({ title: props.activity.title, url: props.activity.url });
  }, [props.activity, initValues]);

  // Iframe preview component used in both edit and read modes
  const preview = !urlError ? (
    <iframe
      src={props.mode !== "read" ? src! : props.activity!.url}
      title="Iframe Activity"
      className="w-full h-[500px] rounded-lg border border-primary/30"
      allowFullScreen
      onLoad={() => setIsLoading(false)}
      hidden={isLoading}
    />
  ) : null;

  // Render edit/write mode with form
  if (props.mode !== "read") {
    return (
      <>
        {/* Display URL validation error if present */}
        {urlError && urlError.length > 0 ? (
          <p className="text-error text-xs font-bold">{urlError}</p>
        ) : null}

        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          {/* Title input field with validation */}
          <Field
            data={data}
            name="title"
            label="Titre"
            placeholder="Titre de l'activité"
          />

          {/* URL input field */}
          <label className="text-sm font-bold">
            <span className="label-text">URL</span>
          </label>
          <input
            className="w-full input input-bordered focus:outline-none disabled:cursor-not-allowed disabled:text-base-content/60"
            type="text"
            name="url"
            value={src ? src : ""}
            onChange={handleUrlChange}
            placeholder="URL de l'iframe"
          />

          {/* Form action buttons */}
          <div className="flex justify-end gap-x-4">
            <button className="btn btn-outline btn-secondary" type="button">
              Annuler
            </button>
            <button className="btn btn-primary" type="submit">
              Enregistrer
            </button>
          </div>

          {/* Preview section - shows iframe if URL is valid */}
          {cleanedUrl ? (
            <div className="relative w-full overflow-hidden rounded-lg">
              {/* Loading skeleton while iframe content loads */}
              {isLoading ? (
                <div className="w-full h-[500px] bg-base-200 flex flex-col justify-center items-center gap-3 animate-pulse">
                  <div className="skeleton w-3/4 h-6 rounded"></div>
                  <div className="skeleton w-5/6 h-6 rounded"></div>
                  <div className="skeleton w-2/3 h-6 rounded"></div>
                  <p className="text-sm text-base-content/60 mt-4">
                    Chargement de la ressource...
                  </p>
                </div>
              ) : null}

              {preview}
            </div>
          ) : (
            // Empty state when no valid URL is provided
            <div className="p-6 bg-base-200 text-center rounded-lg text-base-content/70">
              <p>
                {props.mode === "write"
                  ? "Saisir une URL ci-dessus pour prévisualiser le contenu."
                  : "Aucune ressource iframe disponible."}
              </p>
            </div>
          )}
        </form>
      </>
    );
  }
  // Render read-only mode with just the preview
  return <>{preview}</>;
}
