import Field from "../../../UI/forms/field";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import defaultImage from "../../../../assets/images/bookshelf.jpg";
import { activityImageSize } from "../../../../config/images-sizes";
import MemoizedImageFileUpload from "../../../UI/image-file-upload/image-file-upload";
import SubmitButton from "../../../UI/submit-button";
import type { Activity } from "../../../../utils/interfaces/activity";
import { ACTIVITIES } from "../../../../config/urls";
import DialogImages from "../../../mediatheque/dialog-images";
import useEditImageActivity from "./use-edit-image-activity";
import bgImageGradient from "../../../../utils/bg-image-gradient";

/**
 * Props for the ImageActivityEditor component
 * @property activity - Optional activity to edit
 * @property onCancel - Callback function called when editing is cancelled
 */
type Props = {
  activity?: Activity;
  onCancel: (value: boolean) => void;
  parent?: "lesson" | "resource";
  //  TODO : implements the onSubmit function on the lesson part invocation of this component
  // today the onSubmit is needed to use this componetn from a bonus resource perspective.
  onSubmit?: (fd: FormData) => void;
};

/**
 * Component for editing an image-based activity
 * Allows creating or modifying an activity with an image, title and description
 * Uses a custom hook useEditImageActivity to handle form state and image upload
 */
export default function ImageActivityEditor({
  activity,
  onCancel,
  parent = "lesson",
  onSubmit = undefined,
}: Props) {
  const {
    data,
    handleSubmit,
    image,
    onResetForm,
    setFile,
    showDialog,
    setShowDialog,
    selectedImage,
  } = useEditImageActivity(activity, onCancel, parent, onSubmit);

  /**
   * Styles for the image preview display
   * Handles both uploaded images and existing activity images
   */
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(
      selectedImage
        ? `${ACTIVITIES}images/${selectedImage}`
        : image
          ? image
          : activity?.url
            ? `${ACTIVITIES}images/${activity.url}`
            : defaultImage,
    ),
    width: "100%",
    height: "100%",
    minHeight: "25rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  return (
    <div className="w-full h-[30rem] gap-8 grid grid-cols-1 2xl:grid-cols-2 p-6">
      <Wrapper>
        <span className="h-full flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">
            Informations à propos de l'image
          </h2>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <span className="flex flex-col gap-y-4">
              <Field name="title" label="Titre *" data={data} />
            </span>
            <span className="flex flex-col gap-y-4">
              <MemoizedImageFileUpload
                onSetFile={setFile}
                label=""
                maxSize={activityImageSize}
              />
              <div className="flex justify-end items-center">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setShowDialog(true)}
                >
                  Importer depuis la médiathèque
                </button>
              </div>
            </span>
            <div className="flex justify-between items-center">
              <button
                className="btn btn-primary btn-outline"
                onClick={() => onCancel(false)}
              >
                Annuler
              </button>
              <span className="flex justify-end items-center gap-x-2">
                <button className="btn btn-secondary" onClick={onResetForm}>
                  Réinitialiser
                </button>
                <SubmitButton
                  label="Sauvegarder"
                  isLoading={false}
                  loadingLabel="En cours..."
                />
              </span>
            </div>
          </form>
        </span>
      </Wrapper>
      <div className="flex justify-center">
        <div style={classImage}></div>
      </div>
      <div className="h-[1rem]" />
      {showDialog ? (
        <DialogImages onClose={() => setShowDialog(false)} />
      ) : null}
    </div>
  );
}
