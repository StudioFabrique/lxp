import { FC } from "react";
import { useSelector } from "react-redux";

import ImpoortSkillsActions from "./import-skills-actions.component";
import ImportedSkills from "./imported-skills.component";

type Props = {
  onCloseDrawer: (id: string) => void;
};

const ImportSkills: FC<Props> = ({ onCloseDrawer }) => {
  const skills = useSelector(
    (state: any) => state.parcoursSkills.importedSkills
  );

  return (
    <div className="flex flex-col gap-y-4 px-4">
      <ImpoortSkillsActions />
      {skills ? <ImportedSkills onCloseDrawer={onCloseDrawer} /> : null}
    </div>
  );
};

export default ImportSkills;
