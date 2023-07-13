import React, { useEffect, useState } from "react";
import ImpoortSkillsActions from "./import-skills-actions.component";
import Skill from "../../utils/interfaces/skill";
import { useSelector } from "react-redux";
import ImportedSkills from "./imported-skills.component";

const ImportSkills = () => {
  const [regularSkills, setRegularSkills] = useState<Array<Skill> | null>(null);
  const csvSkills = useSelector((state: any) => state.parcours.importedSkills);

  useEffect(() => {
    setRegularSkills(null);
  }, [csvSkills]);

  const fetchSkills = () => {
    // TODO: implémenter une requête HTTP pour récupérer les compétences depuis la base de données
  };

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <ImpoortSkillsActions onFromDB={fetchSkills} />
      {csvSkills && csvSkills.length > 0 ? (
        <ImportedSkills onCloseDrawer={() => {}} data={csvSkills} />
      ) : (
        <p>La tête à TOTO</p>
      )}
    </div>
  );
};

export default ImportSkills;
