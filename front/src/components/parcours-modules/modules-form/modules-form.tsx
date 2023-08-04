import { FC, FormEvent, FormEventHandler, useEffect, useState } from "react";
import ImageFileUpload from "../../UI/image-file-upload/image-file-upload";
import useInput from "../../../hooks/use-input";
import { regexGeneric, regexNumber } from "../../../utils/constantes";
import User from "../../../utils/interfaces/user";
import Skill from "../../../utils/interfaces/skill";
import AddTeachers from "./add-teacher/add-teacher.component";
import AddSkills from "./add-skill/add-skill.component";
import Module from "../../../utils/interfaces/module";
import { validateImageFile } from "../../../utils/validate-image-file";
import { useDispatch, useSelector } from "react-redux";
import {
  addParcoursModule,
  clearCurrentParcoursModule,
  updateParcoursModule,
} from "../../../store/redux-toolkit/parcours/parcours-modules";
import AddButton from "./buttons/add-button.component";
import EditButton from "./buttons/edit-button.component";

const ModulesForm: FC<{}> = (props) => {
  const currentModuleToEdit: Module | null = useSelector(
    (state: any) => state.parcoursModule.currentModule
  );
  const dispatch = useDispatch();

  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const { value: duration } = useInput((value) => regexNumber.test(value));
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [teachers, setTeachers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [resetFilter, setResetFilter] = useState<boolean>(false);

  const handleSetImage = (file: File) => {
    setImageFile(file);
  };

  const handleClearEdit = () => {
    title.reset();
    description.reset();
    duration.reset();
    setImageFile(null);
    setTeachers([]);
    setSkills([]);
    setResetFilter(true);
    dispatch(clearCurrentParcoursModule());
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (
      !title.isValid ||
      !description.isValid ||
      !duration.isValid ||
      !validateImageFile(imageFile!, 10 * 1024 * 1024) ||
      teachers.length <= 0
    )
      return;
    console.log("request send");
    const module: Module = {
      _id: currentModuleToEdit ? currentModuleToEdit._id : undefined,
      title: title.value,
      description: description.value,
      teachers: teachers,
      skills: skills,
      duration: duration.value,
      imageTemp: imageFile!,
      imageUrl: URL.createObjectURL(imageFile!),
    };
    dispatch(
      currentModuleToEdit
        ? updateParcoursModule(module)
        : addParcoursModule(module)
    );
    handleClearEdit();
  };

  useEffect(() => {
    if (currentModuleToEdit) {
      title.changeValue(currentModuleToEdit.title);
      description.changeValue(currentModuleToEdit.description);
      duration.changeValue(currentModuleToEdit.duration.toString());
      setImageFile(currentModuleToEdit.imageTemp!);
      setTeachers(currentModuleToEdit.teachers);
      setSkills(currentModuleToEdit.skills);
      setResetFilter(true);
    }
  }, [currentModuleToEdit]);

  return (
    <form
      className="flex flex-col gap-y-5 p-5 pr-2 w-[90%]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col">
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

      <div className="flex flex-col">
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
      <AddTeachers
        teachers={teachers}
        setTeachers={setTeachers}
        resetFilter={resetFilter}
        setResetFilter={setResetFilter}
      />

      {/* compétences compo */}
      <AddSkills
        skills={skills}
        setSkills={setSkills}
        resetFilter={resetFilter}
        setResetFilter={setResetFilter}
      />

      <div className="flex flex-col">
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

      <ImageFileUpload maxSize={10 * 1024 * 1024} onSetFile={handleSetImage} />

      <div className="flex justify-between">
        {currentModuleToEdit && (
          <button type="button" className="btn mt-10" onClick={handleClearEdit}>
            Annuler
          </button>
        )}
        {currentModuleToEdit ? <EditButton /> : <AddButton />}
      </div>
    </form>
  );
};

export default ModulesForm;
