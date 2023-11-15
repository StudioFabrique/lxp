/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import React, { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import useInput from "../../../hooks/use-input";
import {
  regexGeneric,
  regexNumber,
  regexOptionalGeneric,
} from "../../../utils/constantes";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import { compressImage } from "../../../helpers/compress-image";
import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";
import MemoizedItemsList from "../../items-list.component";
import { headerImageMaxSize } from "../../../config/images-sizes";
import MemoizedImageFileUpload from "../../UI/image-file-upload/image-file-upload";

interface ModuleFormProps {
  isLoading: boolean;
  currentModule?: any;
  onCancel: () => void;
  onSubmitModule: (formData: FormData) => void;
}

const ModuleForm = React.forwardRef<HTMLInputElement, ModuleFormProps>(
  (props, ref) => {
    const currentModule = props.currentModule ? props.currentModule : null;
    const parcours = useSelector((state: any) => state.parcours);
    const { value: title } = useInput(
      (value) => regexGeneric.test(value),
      currentModule?.title || ""
    );
    const { value: duration } = useInput(
      (value) => regexNumber.test(value),
      currentModule?.duration || null
    );
    const { value: description } = useInput(
      (value) => regexOptionalGeneric.test(value),
      currentModule?.description || ""
    );
    const [image, setImage] = useState<File | null>(null);
    const [thumb, setThumb] = useState<string | null>(
      currentModule?.thumb ?? null
    );
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
    const parcoursInfos = useSelector(
      (state: any) => state.parcoursInformations.infos
    );

    /**
     * définit le style du champ formulaire en fonction de sa validité
     * @param hasError boolean
     * @returns string
     */
    const setInputStyle = (hasError: boolean) => {
      return hasError
        ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
        : "input input-sm input-bordered focus:outline-none w-full";
    };

    /**
     * définit le style du champ formulaire en fonction de sa validité
     * @param hasError boolean
     * @returns string
     */
    const setAreaStyle = (hasError: boolean) => {
      return hasError
        ? "textarea textarea-error text-error textarea-sm textarea-bordered focus:outline-none w-full"
        : "textarea textarea-sm textarea-bordered focus:outline-none w-full";
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

    const classImage: React.CSSProperties = {
      backgroundImage: `url('${
        currentModule ? currentModule.thumb : defaultModuleThumb
      }')`,
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
      const compressedThumb = await compressImage(file, 20);
      if (compressedThumb) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageString = reader.result as string;
          if (imageString) {
            setThumb(imageString);
          }
        };
        reader.readAsDataURL(file);
      } else setThumb(null);
    };

    const fields = [title, description, duration];

    let formIsValid = false;

    if (!currentModule) {
      //  validation en mode création de module
      formIsValid =
        title.isValid &&
        description.isValid &&
        image !== null &&
        thumb !== null &&
        thumb !== undefined;
    } else {
      //  validation en mode mise à jour du module
      formIsValid = title.isValid && description.isValid && duration.isValid;
    }

    const handleSubmitModule = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (formIsValid) {
        const module = {
          formationId: parcours.formation.id,
          id: currentModule ? +currentModule.id : undefined,
          title: title.value,
          description: description.value,
          duration: duration.value,
          minDate: currentModule
            ? currentModule.minDate
            : parcoursInfos.startDate,
          maxDate: currentModule
            ? currentModule.maxDate
            : parcoursInfos.endDate,
          contacts: teachers,
          bonusSkills: skills,
        };
        const formData = new FormData();
        if (image && thumb) {
          formData.append("image", image);
          formData.append("thumb", thumb);
        }
        formData.append("module", JSON.stringify(module));
        props.onSubmitModule(formData);
      } else {
        // affichage des erreurs pour les champs obligatoires et un toast
        fields.forEach((field: any) => field.isSubmitted());
        toast.error("Le formulaire est incomplet");
      }
    };

    const handleCancel = () => {
      props.onCancel();
    };

    return (
      <form className="w-full" onSubmit={handleSubmitModule}>
        <h2 className="text-xl font-bold mb-4">
          {!currentModule ? "Création de module" : "Edition du module"}
        </h2>
        <section className="w-full  grid grid-cols-2 gap-8">
          <article className="flex flex-col gap-y-4">
            {/* titre */}

            <div className="flex flex-col gap-y-4">
              <label htmlFor="title">Titre du module *</label>
              <input
                className={setInputStyle(title.hasError)}
                ref={ref}
                id="title"
                name="title"
                type="text"
                defaultValue={title.value}
                onChange={title.valueChangeHandler}
                onBlur={title.valueBlurHandler}
                placeholder="Exemple: CDA - Promo 2023"
              />
            </div>

            {/* description */}

            <div className="flex flex-col gap-y-4">
              <label htmlFor="description">Description</label>
              <textarea
                className={setAreaStyle(description.hasError)}
                id="description"
                name="description"
                rows={3}
                defaultValue={description.value}
                onChange={description.textAreaChangeHandler}
                onBlur={description.valueBlurHandler}
              />
            </div>

            {/* durée du modules en heures */}

            <div className="flex flex-col gap-y-4">
              <label htmlFor="duration">
                Nombre d'heures *{/* {currentModule ? "*" : ""} */}
              </label>
              <input
                className={setInputStyle(duration.hasError && currentModule)}
                type="number"
                id="duration"
                name="duration"
                min={0}
                defaultValue={duration.value}
                onChange={duration.valueChangeHandler}
                onBlur={duration.valueBlurHandler}
              />
            </div>

            {/* image du module */}

            <div className="w-full flex gap-x-4 items-center">
              {/*  <div className="flex flex-col gap-y-4">
                <label htmlFor="image">
                  {!currentModule
                    ? "Téléverser une image"
                    : "Choisir une nouvelle image"}
                </label>
                <MemoizedModuleFilesUpload setImage={handleUpdateImage} />
              </div> */}
              <MemoizedImageFileUpload
                maxSize={headerImageMaxSize}
                label={
                  !currentModule
                    ? "Téléverser une image *"
                    : "Choisir une nouvelle image"
                }
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
            onClick={handleCancel}
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
  }
);

export default ModuleForm;
