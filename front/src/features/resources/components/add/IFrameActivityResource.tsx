import { Activity } from "../../../../utils/interfaces/activity";
import useResourceIFrame from "../../hooks/useResourceIFrame";
import Wrapper from "../../../../components/wrappers/BoxWrapper";
import ResourceIFrameForm from "./ResourceIFrameForm";
import ResourceIFramePreview from "./ResourceIFramePreview";

/**
 * Props for IFrameActivityResource component
 */
type Props = {
  /** Display mode: read, write, or edit */
  mode: "read" | "write" | "edit";
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
  const {
    data,
    cleanedUrl,
    handleUrlChange,
    handleSubmit,
    src,
    urlError,
    isLoading,
    setIsLoading,
  } = useResourceIFrame(props.activity, props.onSubmit);

  // Render edit/write mode with form
  if (props.mode !== "read") {
    return (
      <div>
        <Wrapper>
          {/* Display URL validation error if present */}
          {urlError && urlError.length > 0 ? (
            <p className="text-error text-xs font-bold">{urlError}</p>
          ) : null}

          {/* Form */}

          <ResourceIFrameForm
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            src={src!}
            cleanedUrl={cleanedUrl}
            data={data}
            onUrlChange={handleUrlChange}
            onSubmit={handleSubmit}
            onCancel={props.onCancel}
          />

          {/* Displays a message when no URL is provided */}
          {!cleanedUrl ? (
            <div className="p-6 bg-base-200 text-center rounded-lg text-base-content/70">
              <p>Saisir une URL ci-dessus pour prévisualiser le contenu.</p>
            </div>
          ) : null}
        </Wrapper>
      </div>
    );
  }

  // Render read-only mode with just the preview
  return (
    <>
      {!urlError ? (
        <ResourceIFramePreview
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          url={props.mode !== "read" ? src! : props.activity!.url}
        />
      ) : null}
    </>
  );
}
("Aucune ressource iframe disponible.");
