/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ZodError } from "zod";
import { useSelector } from "react-redux";

import Field from "../../UI/forms/field";
import MemoizedImageFileUpload from "../../UI/image-file-upload/image-file-upload";
import { headerImageMaxSize } from "../../../config/images-sizes";
import { compressImage } from "../../../helpers/compress-image";
import { validationErrors } from "../../../helpers/validate";
import FieldArea from "../../UI/forms/field-area";
import CustomError from "../../../utils/interfaces/custom-error";
import MemoizedItemsList from "../../items-list.component";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import { moduleUpdateSchema } from "../../../lib/validation/parcours-edit/module-update-schema";
import FieldNumber from "../../UI/forms/field-number";

interface UpdateModuleFormProps {
  useForm: {
    values: Record<string, string>;
    errors: CustomError[];
    onChangeValue: (field: string, value: string) => void;
    onValidationErrors: (data: CustomError[]) => void;
  };
  isLoading: boolean;
  currentModule: any;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const UpdateModuleForm = React.forwardRef<
  HTMLInputElement,
  UpdateModuleFormProps
>((props, ref) => {
  const { values, onChangeValue, errors, onValidationErrors } = props.useForm;

  const formationId = useSelector(
    (state: any) => state.parcours.formation.id
  ) as number;

  const [image, setImage] = useState<File | null>(null);

  const currentModule = props.currentModule;

  const listeContacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];
  const listeSkills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];
  const [teachers, setTeachers] = useState<Contact[] | null>(
    currentModule?.contacts ?? []
  );
  const [skills, setSkills] = useState<Skill[] | null>(
    currentModule?.bonusSkills ?? []
  );

  const data = {
    values,
    onChangeValue,
    errors,
  };

  console.log({ currentModule });

  const classImage: React.CSSProperties = {
    backgroundImage: `data:image/jpeg;base64,${props.currentModule.thumb}`,
    width: "100px",
    height: "100%",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    borderRadius: "5px",
    marginRight: "10px",
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
   * met à jour la liste des formateurs en mémoire
   * le type spécifié est "any" car la liste vient d'un composant réutilisable
   * @param items any[]
   */
  const handleUpdateTeachers = (items: any[]) => {
    setTeachers(items);
  };

  /**
   * met à jour la liste des compétences en mémoire
   * le type spécifié est "any" car la liste vient d'un composant réutilisable
   * @param items any[]
   */
  const handleUpdateSkills = (items: any[]) => {
    setSkills(items);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    try {
      moduleUpdateSchema.parse(values);
    } catch (error: any) {
      if (error instanceof ZodError) {
        onValidationErrors(validationErrors(error));
        return;
      }
    }

    if (!!teachers && teachers?.length > 0) {
      toast.error("Le module doit avoir au moins un formateur");
      return;
    }
    if (!!skills && skills?.length > 0) {
      toast.error("Le module doit avoir au moins une compétence");
      return;
    }

    const formData = new FormData();
    const module = { ...values, formationId };
    formData.append("module", JSON.stringify(module));
    if (image) {
      formData.append("image", image);
    }
    props.onSubmit(formData);
  };

  useEffect(() => {
    if (errors.length > 0) {
      toast.error(errors[0].message);
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmitForm}>
      <h2 className="text-xl font-bold mb-4">Création de module</h2>
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

          {/* duration */}

          <FieldNumber
            label="Durée *"
            name="duration"
            placeholder="Ex : 12"
            min={0}
            data={data}
          />

          {/* image du module */}

          <div className="w-full flex gap-x-4 items-center">
            <MemoizedImageFileUpload
              maxSize={headerImageMaxSize}
              label="Téléverser une image *"
              onSetFile={handleUpdateImage}
            />
            <span style={classImage} />
          </div>
        </article>

        <article className="flex flex-col gap-y-4">
          {/* liste des contacts */}

          <div className="flex flex-col gap-y-4">
            <label htmlFor="teachers">Formateurs du module</label>
            <MemoizedItemsList
              itemsList={listeContacts}
              selectedProp={currentModule ? currentModule.contacts : []}
              propertyToSearch="name"
              placeHolder="Rechercher un formateur de module"
              onUpdateItems={handleUpdateTeachers}
            />
          </div>

          {/* compétences du module */}

          <div className="flex flex-col gap-y-4">
            <label htmlFor="skills">Compétences du module</label>
            <MemoizedItemsList
              itemsList={listeSkills}
              selectedProp={currentModule ? currentModule.bonusSkills : []}
              propertyToSearch="description"
              placeHolder="Rechercher une compétence de module"
              onUpdateItems={handleUpdateSkills}
            />
          </div>
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

export default UpdateModuleForm;
