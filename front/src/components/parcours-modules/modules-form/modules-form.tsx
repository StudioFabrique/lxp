import { FC, FormEvent, FormEventHandler, useState } from "react";
import ImageFileUpload from "../../UI/image-file-upload/image-file-upload";
import useInput from "../../../hooks/use-input";
import { regexGeneric, regexNumber } from "../../../utils/constantes";
import User from "../../../utils/interfaces/user";
import Skill from "../../../utils/interfaces/skill";
import AddTeachers from "./add-teacher/add-teacher.component";
import AddSkills from "./add-skill/add-skill.component";

const ModulesForm: FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));
  const { value: nbHours } = useInput((value) => regexNumber.test(value));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const handleSetImage = (file: File) => {
    setImageFile(file);
    console.log(file);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (
      !title.isValid ||
      !description.isValid ||
      !nbHours.isValid ||
      /* !imageFile || */
      teachers.length <= 0
    )
      return;
    console.log("request send");
    const teachersId: string[] = teachers.map((teacher) => teacher._id);
    const skillsId: number[] = skills.map((skill) => skill.id!);
    const module = { title: title, description: description };
    onSubmit(module);
  };

  return (
    <form className="flex flex-col gap-y-4 p-4" onSubmit={handleSubmit}>
      <div className="flex flex-col">
        <label htmlFor="title">Titre de module</label>
        <input
          className="input input-sm w-full"
          name="title"
          type="text"
          value={title.value.value}
          onChange={title.valueChangeHandler}
          onBlur={title.valueBlurHandler}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="description">Description de module</label>
        <input
          className="input input-sm w-full"
          name="description"
          type="text"
          value={description.value}
          onChange={description.valueChangeHandler}
          onBlur={description.valueBlurHandler}
        />
      </div>

      {/* formateurs compo */}
      <AddTeachers teachers={teachers} setTeacher={setTeachers} />

      {/* compétences compo */}
      <AddSkills skills={skills} setSkills={setSkills} />

      <div className="flex flex-col">
        <label htmlFor="nbHours">Nombre d'heures</label>
        <input
          className="input input-sm w-full"
          name="nbHours"
          type="number"
          value={nbHours.value}
          onChange={nbHours.valueChangeHandler}
          onBlur={nbHours.valueBlurHandler}
        />
      </div>

      <ImageFileUpload maxSize={10} onSetFile={handleSetImage} />

      <button type="submit" className="btn mt-10">
        Ajouter le module
      </button>
    </form>
  );
};

export default ModulesForm;
