import { Dispatch, FC, SetStateAction, useState } from "react";
import { skillsData } from "./skills-data";
import Skill from "../../../../utils/interfaces/skill";
import SkillsList from "./skills-list.component";
import SearchDropdownMultiple from "../../../UI/search-dropdown-multiple/search-dropdown-multiple";

const AddSkills: FC<{
  skills: Skill[];
  setSkills: Dispatch<SetStateAction<Skill[]>>;
}> = ({ skills, setSkills }) => {
  const [skillsAvailables, setSkillsAvailables] = useState<Skill[]>(skillsData);

  const handleAddSkill = (id: number) => {
    console.log(id);

    const SkillsToAdd = skillsAvailables.filter((skill) => skill.id === id);
    setSkills((currentSkills) => [...currentSkills, ...SkillsToAdd]);
    setSkillsAvailables((currentSkillsAvailable) =>
      currentSkillsAvailable.filter(
        (currentSkillAvailable) => currentSkillAvailable.id !== id
      )
    );
  };

  const handleDeleteSkill = (id: number) => {
    setSkills((currentSkills) =>
      currentSkills.filter((skill) => skill.id !== id)
    );

    setSkillsAvailables((currentSkillsAvailable) => [
      ...currentSkillsAvailable,
      ...skills.filter((currentSkills) => currentSkills.id === id),
    ]);
  };

  return (
    <div className="flex flex-col">
      <label htmlFor="formateurs">Compétences de module</label>
      <SearchDropdownMultiple
        propertyToFilter="id"
        data={skillsAvailables}
        propertiesToSearch={["description"]}
        placeHolder="Description"
        transparencyOrder="z-0"
        onAddItem={handleAddSkill}
      />
      <SkillsList skills={skills} onDelete={handleDeleteSkill} />
    </div>
  );
};

export default AddSkills;
