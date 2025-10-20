/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { useSelector } from "react-redux";

import Field from "../../UI/forms/field";
import MemoizedImageFileUpload from "../../UI/image-file-upload/image-file-upload";
import { headerImageMaxSize } from "../../../config/images-sizes";
import { compressImage } from "../../../helpers/compress-image";
import { moduleCreateSchema } from "../../../lib/validation/parcours-edit/module-create-schema";
import { validationErrors } from "../../../helpers/validate";
import FieldArea from "../../UI/forms/field-area";
import CustomError from "../../../utils/interfaces/custom-error";
import ModuleToParcours from "../../../views/module/add/module-to-parcours";
import Skill from "../../../utils/interfaces/skill";
import Contact from "../../../utils/interfaces/contact";

interface CreateModuleFormProps {
  useForm: {
    values: Record<string, string>;
    errors: CustomError[];
    onChangeValue: (field: string, value: string) => void;
    onValidationErrors: (data: CustomError[]) => void;
  };
  isLoading: boolean;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
  contacts: Contact[];
  skills: Skill[];
}

const CreateModuleForm = React.forwardRef<
  HTMLInputElement,
  CreateModuleFormProps
>((props, ref) => {
  const { values, onChangeValue, errors, onValidationErrors } = props.useForm;

  const formationId = useSelector(
    (state: any) => state.parcours.formation.id
  ) as number;

  const [image, setImage] = useState<File | null>(null);

  // objet passé en prop aux champs du formulaire
  const data = {
    values,
    onChangeValue,
    errors,
  };

  // compresse l'image sélectionnée et génère un aperçu de taille réduite et le convertitt en chaîne de caractère pour être stocké sous forme de blob
  const handleUpdateImage = async (file: File) => {
    const compressedHeadImage = await compressImage(file, 1920);
    if (compressedHeadImage) {
      setImage(compressedHeadImage);
    } else {
      setImage(null);
    }
  };

  /**
   * soumet le formulaire au backend après validation
   * @param event React.FormEvent
   * @returns
   */
  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      moduleCreateSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        return;
      }
    }

    const formData = new FormData();
    const module = { ...values, formationId };
    formData.append("module", JSON.stringify(module));
    if (image) formData.append("image", image);
    props.onSubmit(formData);
  };

  /**
   * gère les erreurs HTTP
   */
  useEffect(() => {
    if (errors.length > 0) {
      toast.error(errors[0].message);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmitForm}>
      <section className="w-full  grid grid-cols-2 gap-8">
        <article className="flex flex-col gap-y-4">
          {/* titre */}

          <div ref={ref}>
            <Field
              label="Titre du module *"
              name="title"
              placeholder="Ex : Javascript"
              data={data}
            />
          </div>

          {/* description */}

          <FieldArea label="Description" name="description" data={data} />

          {/* image du module */}

          <div className="w-full flex gap-x-4 items-center">
            <MemoizedImageFileUpload
              maxSize={headerImageMaxSize}
              label="Téléverser une image *"
              onSetFile={handleUpdateImage}
            />
          </div>
        </article>
        <article className="flex flex-col justify-start items-center gap-y-4">
          <ModuleToParcours
            contacts={props.contacts}
            isLoading={false}
            skills={props.skills}
            currentContacts={[]}
            currentSkills={[]}
            setCurrentContacts={() => {}}
            setCurrentSkills={() => {}}
          />
        </article>
      </section>
      <div className="w-full flex justify-between mt-8">
        <button
          className="btn btn-primary btn-outline"
          type="button"
          onClick={props.onCancel}
        >
          Annuler
        </button>
        {props.isLoading ? (
          <button className="btn btn-primary" type="button">
            <span className="loading loading-spinner"></span>
            Validation en cours
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={props.isLoading}
            type="submit"
          >
            Valider
          </button>
        )}
      </div>
    </form>
  );
});

export default CreateModuleForm;
