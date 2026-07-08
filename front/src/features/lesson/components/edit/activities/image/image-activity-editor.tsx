import Field from "../../../../../../../src.legacy/components/UI/forms/field";
import Wrapper from "../../../../../../../src.legacy/components/UI/wrapper/wrapper.component";
import defaultImage from "../../../../../../../src.legacy/assets/images/bookshelf.jpg";
import { activityImageSize } from "../../../../../../config/images-sizes";
import MemoizedImageFileUpload from "../../../../../../../src.legacy/components/UI/image-file-upload/image-file-upload";
import SubmitButton from "../../../../../../../src.legacy/components/UI/submit-button";
import type { Activity } from "../../../../../../../src/utils/interfaces/activity";
import { ACTIVITIES } from "../../../../../../config/urls";
import DialogImages from "../../../../../../../src.legacy/components/mediatheque/dialog-images";
import useEditImageActivity from "./use-edit-image-activity";
import bgImageGradient from "../../../../../../utils/helpers/bg-image-gradient";

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
    data,
    handleSubmit,
    image,
    onResetForm,
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
        : defaultImage
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
