import React, { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import ImpoortSkillsActions from "./import-skills-actions.component";
import ImportedSkills from "./imported-skills.component";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportSkills: FC<Props> = ({ onCloseDrawer }) => {
  const skills = useSelector((state: any) => state.parcours.importedSkills);
  const [fromDB, setFromDB] = useState<boolean>(false); // définit si les compétences ont été importées à partrir de la bdd ou d'un fichier CSV

  const handleFromDB = useCallback((value: boolean) => {
    setFromDB(value);
  }, []);

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <ImpoortSkillsActions onFromDB={handleFromDB} />
      {skills ? (
        <ImportedSkills
          fromDB={fromDB}
          onCloseDrawer={onCloseDrawer}
          data={skills}
        />
      ) : null}
    </div>
  );
};

export default ImportSkills;
