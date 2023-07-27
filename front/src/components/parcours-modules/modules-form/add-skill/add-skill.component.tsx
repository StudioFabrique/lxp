import { Dispatch, FC, SetStateAction, useState } from "react";
import SearchDropdown from "../../../UI/search-dropdown/search-dropdown";
import { skillsData } from "./skills-data";
import Skill from "../../../../utils/interfaces/skill";
import SkillsList from "./skills-list.component";

const AddSkills: FC<{
  skills: Skill[];
  setSkills: Dispatch<SetStateAction<Skill[]>>;
}> = ({ skills, setSkills }) => {
  const [skillsAvailables, setSkillsAvailables] = useState<Skill[]>(skillsData);

  const getSkillFromDb = (id: number) => {
    return skillsData.filter((skill) => skill.id === id)[0];
  };

  const handleAddSkill = (name: string, property: string) => {
    console.log("name : " + name);
    console.log("property : " + property);
    setSkills((currentSkills) => [
      ...currentSkills,
      getSkillFromDb(parseInt(name)),
    ]);
  };

  const handleFilterSkillsAvailables = (name: string, property: string) => {
    const filteredTeachersAvailable = skillsAvailables.filter(
      (skill) => skill.id === parseInt(name)
    );
    setSkillsAvailables(filteredTeachersAvailable);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="formateurs">Formateurs de module</label>
      <SearchDropdown
        placeHolder="Rechercher une compétence de module"
        addItem={handleAddSkill}
        filterItems={handleFilterSkillsAvailables}
        filteredItems={skillsAvailables}
        property="description"
        resetFilterItems={() => {}}
        getId="id"
      />
      <SkillsList skills={skills} />
    </div>
  );
};

export default AddSkills;
