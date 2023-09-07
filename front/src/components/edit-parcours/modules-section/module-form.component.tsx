import { useSelector } from "react-redux";
import { FormEvent, useState } from "react";

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
import AddIcon from "../../UI/svg/add-icon";
import { compressImage } from "../../../helpers/compress-image";
import MemoizedModuleFilesUpload from "./module-files-upload.component";

interface ModuleFormProps {
  onSubmitNewModule: (module: any, file: File) => void;
}

const ModuleForm = (props: ModuleFormProps) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: duration } = useInput((value) => regexNumber.test(value));
  const { value: description } = useInput((value) =>
    regexOptionalGeneric.test(value)
  );
  const [image, setImage] = useState<File | null>(null);
  const [thumb, setThumb] = useState<string | null>(null);
  const listeContacts = useSelector(
    (state: any) => state.parcoursContacts.currentContacts
  ) as Contact[];
  const listeSkills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];
  const [teachers, setTeachers] = useState<Contact[] | null>(null);
  const [skills, setSkills] = useState<Skill[] | null>(null);
  const { sendRequest, isLoading } = useHttp();

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
        parcoursId: 1,
      };
      const formData = new FormData();
      formData.append("image", image);
      formData.append("thumb", thumb);
      formData.append("module", JSON.stringify(module));

      const applyData = (data: any) => {
        console.log(data);
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

  return (
    <form className="w-full" onSubmit={handleSubmitModule}>
      <section className="w-full  grid grid-cols-2 gap-8">
        <article className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <label htmlFor="title">Titre du module *</label>
            <input
              className={setInputStyle(title.hasError)}
              id="title"
              name="title"
              type="text"
              defaultValue={title.value}
              onChange={title.valueChangeHandler}
              onBlur={title.valueBlurHandler}
              placeholder="Exemple: CDA - Promo 2023"
            />
          </div>
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
          <div className="flex flex-col gap-y-4">
            <label htmlFor="image">Téléverser une image</label>
            <MemoizedModuleFilesUpload setImage={handleUpdateImage} />
          </div>
        </article>
        <article className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-4">
            <label htmlFor="teachers">Formateurs du module</label>
            <MemoizedItemsList
              itemsList={listeContacts}
              propertyToSearch="name"
              placeHolder="Rechercher un formateur de module"
              onUpdateItems={handleUpdateTeachers}
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <label htmlFor="skills">Compétences du module</label>
            <MemoizedItemsList
              itemsList={listeSkills}
              propertyToSearch="description"
              placeHolder="Rechercher une compétence de module"
              onUpdateItems={handleUpdateSkills}
            />
          </div>
        </article>
      </section>
      <div className="w-full flex justify-end mt-8">
        {isLoading ? (
          <button className="btn btn-primary" type="button">
            <span className="loading loading-spinner"></span>
            Ajout en cours
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={isLoading}
            type="submit"
          >
            <span className="w-6 h-6">
              <AddIcon />
            </span>
            Ajouter le module
          </button>
        )}
      </div>
    </form>
  );
};

export default ModuleForm;
