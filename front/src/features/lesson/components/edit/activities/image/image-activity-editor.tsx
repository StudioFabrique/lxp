import Wrapper from "../../../../../../../src/components/wrappers/BoxWrapper";
import defaultImage from "../../../../../../../src/assets/images/bookshelf.jpg";
import { activityImageSize } from "../../../../../../config/images-sizes";
import FileUpload from "../../../../../../components/UI/file-upload/FileUpload";
import SubmitButton from "../../../../../../components/UI/submit-button";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import { ACTIVITIES } from "../../../../../../config/urls";
import DialogImages from "../../../../../mediatheque/components/dialog-images";
import useEditImageActivity from "./use-edit-image-activity";
import { bgImageGradient } from "../../../../../../utils/helpers/color-helpers";
import ActivityHeader from "../activity-header";

type Props = {
  activity?: Activity;
  onCancel: (value: boolean) => void;
  parent?: "lesson" | "resource";
  onSubmit?: (fd: FormData) => void;
};

export default function ImageActivityEditor({
  activity,
  onCancel,
  parent = "lesson",
  onSubmit = undefined,
}: Props) {
  const {
    register,
    watch,
    errors,
    handleSubmit,
    image,
    reset,
    setFile,
    showDialog,
    setShowDialog,
    selectedImage,
  } = useEditImageActivity(activity, onCancel, parent, onSubmit);

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
    <div className="w-full h-fit gap-8 grid grid-cols-1 3xl:grid-cols-2 p-6">
      <Wrapper>
        <span className="h-full flex flex-col gap-y-2">
          <ActivityHeader
            title={watch("title") ?? ""}
            activityType="image"
            titleEditable
            titleError={errors.title?.message}
            onEditTitle={(value) =>
              register("title").onChange({ target: { value } })
            }
            titlePlaceholder="Titre de l'image"
            onCancel={() => onCancel(false)}
          />
          <h2 className="text-lg font-bold">
            Informations à propos de l'image
          </h2>
          <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
            <span className="flex flex-col gap-y-4">
              <FileUpload
                onFileSelect={setFile}
                fileType="image"
                buttonLabel="Sélectionner une image"
                helperText="JPG, PNG, WebP ou GIF"
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
            <div className="flex justify-end items-center gap-x-2">
              <button className="btn btn-secondary" onClick={() => reset()}>
                Réinitialiser
              </button>
              <SubmitButton
                label="Sauvegarder"
                isLoading={false}
                loadingLabel="En cours..."
              />
            </div>
          </form>
        </span>
      </Wrapper>
      <div className="flex justify-center">
        <div style={classImage}></div>
      </div>
      <div className="h-4" />
      {showDialog ? (
        <DialogImages onClose={() => setShowDialog(false)} />
      ) : null}
    </div>
  );
}
