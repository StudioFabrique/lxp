import Field from "../../../UI/forms/field";
import FieldArea from "../../../UI/forms/field-area";
import useForm from "../../../UI/forms/hooks/use-form";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import defaultImage from "../../../../assets/images/bookshelf.jpg";
import { useEffect, useState } from "react";
import { activityImageSize } from "../../../../config/images-sizes";
import MemoizedImageFileUpload from "../../../UI/image-file-upload/image-file-upload";
import { z, ZodError } from "zod";
import { regexGeneric } from "../../../../utils/constantes";
import { validationErrors } from "../../../../helpers/validate";
import SubmitButton from "../../../UI/submit-button";
import toast from "react-hot-toast";
import useHttp from "../../../../hooks/use-http";
import SuccessWithMessage from "../../../../utils/interfaces/success-with-message";
import { useParams } from "react-router-dom";
import Activity from "../../../../utils/interfaces/activity";
import { ACTIVITIES } from "../../../../config/urls";

type Props = {
  activity?: Activity;
  onCancel: (value: boolean) => void;
};

export default function ImageActivityEditor({ activity, onCancel }: Props) {
  const { errors, values, onChangeValue, onValidationErrors, onResetForm } =
    useForm();
  const data = { values, errors, onChangeValue };
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const { sendRequest } = useHttp();
  const { lessonId } = useParams();

  const classImage: React.CSSProperties = {
    backgroundImage: `url('${
      image ?? (activity ? `${ACTIVITIES}images/${activity.url}` : defaultImage)
    }')`,
    width: "100%",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "0.75rem",
  };

  const imageActivitySchema = z.object({
    title: z
      .string({ required_error: "Un titre est requis" })
      .regex(regexGeneric, {
        message: "Le titre contient des caractères non autorisés",
      }),
    description: z
      .string({ required_error: "Une description est requise" })
      .regex(regexGeneric, {
        message: "La description contient des caracèteres non autorisés",
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
    if (!activity && !file) {
      toast.error("Un fichier est requis");
      return;
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
        path: `/activity/image/${activity?.id ?? lessonId}`,
        method: activity ? "put" : "post",
        body: formData,
      },
      applyData
    );
  };

  // affichage de la nouvelle image
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageString = reader.result as string;
        setImage(imageString);
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

  return (
    <div className="w-full h-[30rem] gap-8 grid grid-cols-1 2xl:grid-cols-2 p-6">
      <Wrapper>
        <span className="h-full flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">
            Informations à propos de l'image
          </h2>
          <form
            className="flex flex-col justify-around h-full"
            onSubmit={handleSubmit}
          >
            <span className="flex flex-col gap-y-4">
              <Field name="title" label="Titre *" data={data} />
              <FieldArea name="description" data={data} label="Description *" />
            </span>
            <MemoizedImageFileUpload
              onSetFile={setFile}
              label=""
              maxSize={activityImageSize}
            />
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
      <div style={classImage}></div>
    </div>
  );
}
