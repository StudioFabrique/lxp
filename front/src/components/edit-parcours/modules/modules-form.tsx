import { FC, FormEvent, FormEventHandler, useEffect, useState } from "react";
import ImageFileUpload from "../../UI/image-file-upload/image-file-upload";
import useInput from "../../../hooks/use-input";
import { regexGeneric, regexNumber } from "../../../utils/constantes";
import User from "../../../utils/interfaces/user";
import Skill from "../../../utils/interfaces/skill";
import Module from "../../../utils/interfaces/module";
import { validateImageFile } from "../../../utils/validate-image-file";
import { useDispatch, useSelector } from "react-redux";
import { parcoursModulesSliceActions } from "../../../store/redux-toolkit/parcours/parcours-modules";
import DataAdder from "../../UI/data-adder/data-adder";
// import { getDBSkills as skillsData } from "../../../utils/fixtures/skills";
import { Toaster, toast } from "react-hot-toast";
import { AddIcon1 } from "../../UI/svg/add-icons";
import { useParams } from "react-router-dom";
import useHttp from "../../../hooks/use-http";

const ModulesForm: FC<{}> = () => {
  const { id: parcoursId } = useParams();

  const { sendRequest } = useHttp();

  const currentModuleToEdit: Module | null = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const skillsFromDb = useSelector((state: any) => state.parcoursSkills.skills);
  const contactsFromDb = useSelector(
    (state: any) => state.parcoursContacts.initialContacts
  );
  const dispatch = useDispatch();

  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const { value: duration } = useInput((value) => regexNumber.test(value));
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [contacts, setContacts] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]); // to replace by redux store data
  const [resetFilter, setResetFilter] = useState<boolean>(false);

  const handleSetImage = (file: File) => {
    setImageFile(file);
  };

  const handleClearEdit = () => {
    dispatch(parcoursModulesSliceActions.clearCurrentParcoursModule());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    console.log(imageFile);

    event.preventDefault();
    if (
      !title.isValid ||
      !description.isValid ||
      !duration.isValid ||
      skills.length <= 0 ||
      !imageFile
    ) {
      toast.error("les informations saisies sont incorrects");
      return;
    }
    if (!validateImageFile(imageFile!, 10 * 1024 * 1024)) {
      toast.error("Le fichier de l'image doit être inférieur à 10 mb");
      return;
    }
    const module: Module = {
      title: title.value,
      description: description.value,
      contacts: contacts,
      bonusSkills: skills,
      duration: parseInt(duration.value),
    };

    const applyData = (data: any) => {
      console.log(data);
      const moduleDb = data.module;
      currentModuleToEdit
        ? dispatch(
            parcoursModulesSliceActions.updateParcoursModule({
              moduleDb,
            })
          )
        : dispatch(parcoursModulesSliceActions.addParcoursModule({ moduleDb }));
      handleClearEdit();
    };

    const formData = new FormData();
    formData.append("module", JSON.stringify(module));
    formData.append("image", imageFile);
    !currentModuleToEdit && formData.append("parcoursId", parcoursId!);
    currentModuleToEdit &&
      formData.append("moduleId", currentModuleToEdit.id!.toString());

    // do the request
    sendRequest(
      {
        path: "/module",
        method: currentModuleToEdit ? "put" : "post",
        body: formData,
      },
      applyData
    );
  };

  useEffect(() => {
    title.changeValue(currentModuleToEdit?.title ?? "");
    description.changeValue(currentModuleToEdit?.description ?? "");
    duration.changeValue(currentModuleToEdit?.duration.toString() ?? "");
    setImageFile(null);
    setContacts(currentModuleToEdit?.contacts ?? []);
    setSkills(currentModuleToEdit?.bonusSkills ?? []);
    setResetFilter(true);
  }, [currentModuleToEdit]);

  useEffect(() => {
    dispatch(parcoursModulesSliceActions.clearCurrentParcoursModule());
  }, [dispatch]);

  return (
    <form
      className="flex flex-col gap-y-5 p-5 pr-2 w-[90%]"
      onSubmit={handleSubmit}
    >
      <Toaster />
      <div className="flex flex-col gap-y-2">
        <label htmlFor="title">Titre de module</label>
        <input
          className="input input-sm w-full"
          name="title"
          type="text"
          value={title.value}
          onChange={title.valueChangeHandler}
          onBlur={title.valueBlurHandler}
        />
      </div>

      <div className="flex flex-col gap-y-2">
        <label htmlFor="description">Description de module</label>
        <textarea
          className="input input-sm w-full h-20"
          name="description"
          value={description.value}
          onChange={description.textAreaChangeHandler}
          onBlur={description.valueBlurHandler}
        />
      </div>

      {/* formateurs compo */}
      <DataAdder
        data={contacts}
        dataFromDb={contactsFromDb}
        propertiesToSearch={["name"]}
        propertyToFilter="idMdb"
        resetFilter={resetFilter}
        searchInputPlaceholder="Prénom Nom"
        setData={setContacts}
        setResetFilter={setResetFilter}
        title="Formateurs de modules"
        transparencyOrder="z-10"
      />

      {/* compétences compo */}
      <DataAdder
        data={skills}
        dataFromDb={skillsFromDb}
        propertiesToSearch={["description"]}
        propertyToFilter="id"
        resetFilter={resetFilter}
        searchInputPlaceholder="description"
        setData={setSkills}
        setResetFilter={setResetFilter}
        title="Compétences"
        transparencyOrder="z-0"
      />

      <div className="flex flex-col gap-y-2">
        <label htmlFor="nbHours">Nombre d'heures</label>
        <input
          className="input input-sm w-full"
          name="nbHours"
          type="number"
          value={duration.value}
          onChange={duration.valueChangeHandler}
          onBlur={duration.valueBlurHandler}
        />
      </div>

      <ImageFileUpload
        type={2}
        maxSize={10 * 1024 * 1024}
        onSetFile={handleSetImage}
      />

      <div className="pt-10 flex justify-between">
        {currentModuleToEdit && (
          <button type="button" className="btn" onClick={handleClearEdit}>
            Annuler
          </button>
        )}
        <button
          className="btn flex gap-x-4 items-center bg-secondary-focus px-5 py-2 rounded-lg"
          type="submit"
        >
          {currentModuleToEdit ? (
            <p>Modifier le module</p>
          ) : (
            <>
              <AddIcon1 />
              <p>Ajouter le module</p>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ModulesForm;
