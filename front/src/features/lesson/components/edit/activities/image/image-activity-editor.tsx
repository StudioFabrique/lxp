import { useState } from "react";
import { activityImageSize } from "../../../../../../config/images-sizes";
import ImageFileUpload, {
  type TemporaryImage,
} from "../../../../../../components/UI/image-file-upload/image-file-upload";
import SubmitButton from "../../../../../../components/UI/submit-button";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import { ACTIVITIES } from "../../../../../../config/urls";
import DialogImages from "../../../../../mediatheque/components/dialog-images";
import useEditImageActivity from "./use-edit-image-activity";
import ActivityHeader from "../activity-header";

type Props = {
  activity?: Activity;
  onCancel: (value: boolean) => void;
  parent?: "lesson" | "resource";
  onSubmit?: (fd: FormData) => void;
  parentId?: number;
  onSaved?: () => void | Promise<void>;
};

export default function ImageActivityEditor({
  activity,
  onCancel,
  parent = "lesson",
  onSubmit = undefined,
  parentId,
  onSaved,
}: Props) {
  const {
    watch,
    errors,
    handleSubmit,
    isLoading,
    reset,
    setFile,
    setValue,
    setSelectedImage,
    showDialog,
    setShowDialog,
    selectedImage,
  } = useEditImageActivity(
    activity,
    onCancel,
    parent,
    onSubmit,
    parentId,
    onSaved,
  );

  const [temporaryImage, setTemporaryImage] = useState<TemporaryImage>({
    file: null,
    url: null,
  });

  const handleTemporaryImageChange = (nextImage: TemporaryImage) => {
    setTemporaryImage(nextImage);
    setFile(nextImage.file);
    if (nextImage.file) setSelectedImage(null);
  };

  const existingImage = selectedImage
    ? `${ACTIVITIES}images/${selectedImage}`
    : activity?.url
      ? `${ACTIVITIES}images/${activity.url}`
      : undefined;
  const displayedTemporaryImage = selectedImage
    ? { file: null, url: null }
    : temporaryImage;

  return (
    <div className="w-full h-fit grid grid-cols-1 3xl:grid-cols-2 p-6">
      <span className="h-full flex flex-col items-center gap-10">
        <ActivityHeader
          title={watch("title") ?? ""}
          activityType="image"
          titleEditable
          titleError={errors.title?.message}
          onEditTitle={(value) =>
            setValue("title", value, { shouldDirty: true, shouldValidate: true })
          }
          titlePlaceholder="Titre de l'image"
          cancelDisabled={isLoading}
          onCancel={() => onCancel(false)}
        />
        <ImageFileUpload
          temporaryImage={displayedTemporaryImage}
          onSetTemporaryImage={handleTemporaryImageChange}
          existingImage={existingImage}
          maxSize={activityImageSize}
          variant="image"
        >
          Ajouter une image
        </ImageFileUpload>
        <form
          className="flex flex-col self-end gap-y-4"
          onSubmit={handleSubmit}
        >
          <span className="flex flex-col gap-y-4">
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
              isLoading={isLoading}
              loadingLabel="En cours..."
            />
          </div>
        </form>
      </span>

      <div className="h-4" />
      {showDialog ? (
        <DialogImages onClose={() => setShowDialog(false)} />
      ) : null}
    </div>
  );
}
