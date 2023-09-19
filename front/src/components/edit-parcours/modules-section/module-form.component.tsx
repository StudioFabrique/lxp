import { useSelector } from "react-redux";
import React, { FormEvent, useState } from "react";

import useInput from "../../../hooks/use-input";
import {
  regexGeneric,
  regexNumber,
  regexOptionalGeneric,
} from "../../../utils/constantes";
import Contact from "../../../utils/interfaces/contact";
import Skill from "../../../utils/interfaces/skill";
import MemoizedItemsList from "./items-list.component";
import useHttp from "../../../hooks/use-http";
import { compressImage } from "../../../helpers/compress-image";
import MemoizedModuleFilesUpload from "./module-files-upload.component";
import { useDispatch } from "react-redux";
import {
  addNewModule,
  setCurrentModule,
  toggleEditionMode,
  toggleInitialRender,
  toggleNewModule,
} from "../../../store/redux-toolkit/parcours/parcours-modules";
import { defaultModuleThumb } from "../../../lib/defautltModuleThumb";

interface ModuleFormProps {
  onSubmitNewModule: (module: any, file: File) => void;
}

const ModuleForm = React.forwardRef<HTMLInputElement, ModuleFormProps>(
  (props, ref) => {
    const dispatch = useDispatch();
    const currentModule = useSelector(
      (state: any) => state.parcoursModule.currentModule
    );
    const parcours = useSelector((state: any) => state.parcours);
    const { value: title } = useInput(
      (value) => regexGeneric.test(value),
      currentModule.title
    );
    const { value: duration } = useInput(
      (value) => regexNumber.test(value),
      currentModule.duration
    );
    const { value: description } = useInput(
      (value) => regexOptionalGeneric.test(value),
      currentModule.description
    );
    const [image, setImage] = useState<File | null>(null);
    const [thumb, setThumb] = useState<string | null>(
      currentModule.thumb ?? null
    );
    const listeContacts = useSelector(
      (state: any) => state.parcoursContacts.currentContacts
    ) as Contact[];
    const listeSkills = useSelector(
      (state: any) => state.parcoursSkills.skills
    ) as Skill[];
    const [teachers, setTeachers] = useState<Contact[] | null>(
      currentModule.contacts ?? null
    );
    const [skills, setSkills] = useState<Skill[] | null>(
      currentModule.bonusSkills ?? null
    );
    const { sendRequest, isLoading } = useHttp();

    console.log({ teachers });

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

    const handleUpdateTeachers = (items: any[]) => {
      setTeachers(items);
    };

    const handleUpdateSkills = (items: any[]) => {
      setSkills(items);
    };

    const classImage: React.CSSProperties = {
      backgroundImage: `url('${
        currentModule.thumb ? currentModule.thumb : defaultModuleThumb
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

    const handleSubmitModule = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formIsValid =
        title.isValid &&
        description.isValid &&
        duration.isValid &&
        teachers &&
        teachers?.length > 0 &&
        skills &&
        skills.length > 0 &&
        image &&
        thumb;

      if (formIsValid) {
        const module = {
          title: title.value,
          description: description.value,
          duration: duration.value,
          contacts: teachers,
          bonusSkills: skills,
          formations: [1],
          parcoursId: parcours.id,
        };
        const formData = new FormData();
        formData.append("image", image);
        formData.append("thumb", thumb);
        formData.append("module", JSON.stringify(module));

        const applyData = (data: any) => {
          console.log(data);
          const module = {
            ...data.data,
            id: data.data.id.toString(),
            contacts: data.data.contacts.map(
              (itemContact: any) => itemContact.contact
            ),
            bonusSkills: data.data.bonusSkills.map(
              (itemBonusSkills: any) => itemBonusSkills.bonusSkill
            ),
          };
          dispatch(toggleEditionMode(false));
          dispatch(addNewModule(module));
          dispatch(toggleInitialRender(true));
          dispatch(setCurrentModule(null));
          dispatch(toggleNewModule(false));
          console.log("fini");
        };
        sendRequest(
          {
            path: "/modules/new-module",
            method: "put",
            body: formData,
          },
          applyData
        );
      } else console.log("oops");
    };

    const handleCancel = () => {
      dispatch(toggleEditionMode(false));
      dispatch(toggleNewModule(false));
      dispatch(setCurrentModule(null));
    };

    console.log(currentModule.contacts);
    console.log(currentModule.bonusSkills);

    return (
      <form className="w-full" onSubmit={handleSubmitModule}>
        <h2 className="text-xl font-bold mb-4">
          {currentModule.isNewModule
            ? "Création de module"
            : "Edition du module"}
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
              <label htmlFor="duration">Nombre d'heures</label>
              <input
                className={setInputStyle(duration.hasError)}
                type="number"
                id="duration"
                name="duration"
                defaultValue={duration.value}
                onChange={duration.valueChangeHandler}
                onBlur={duration.valueBlurHandler}
              />
            </div>

            {/* image du module */}

            <div className="w-full flex gap-x-4 items-center">
              <span style={classImage}></span>
              <div className="flex flex-col gap-y-4">
                <label htmlFor="image">Téléverser une image</label>
                <MemoizedModuleFilesUpload setImage={handleUpdateImage} />
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-y-4">
            {/* liste des contacts */}

            <div className="flex flex-col gap-y-4">
              <label htmlFor="teachers">Formateurs du module</label>
              <MemoizedItemsList
                itemsList={listeContacts}
                selectedProp={currentModule.contacts}
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
                selectedProp={currentModule.bonusSkills}
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
          {isLoading ? (
            <button className="btn btn-primary" type="button">
              <span className="loading loading-spinner"></span>
              Validation en cours
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={isLoading}
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
