import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import SkillForm from "./skill-form";
import Skill from "../../utils/interfaces/skill";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

type Props = {
  skillToEdit: Skill;
};

const SkillUpdateDrawer: FC<Props> = ({ skillToEdit }) => {
  const dispatch = useDispatch();
  const [skill, setSkill] = useState<Skill | null>(skillToEdit);

  const submitUpdateSkill = (skill: Skill) => {
    dispatch(parcoursAction.editSkill(skill));
    setSkill(null);
    closeUpdateSkillDrawer("update-skill");
  };

  useEffect(() => {
    if (skill) {
      document.getElementById("update-skill")?.click();
    }
  }, [skill]);

  const closeUpdateSkillDrawer = (idDrawer: string) => {
    document.getElementById(idDrawer)?.click();
    setSkill(null);
  };

  console.log({ skill });
  console.log("render");

  return (
    <RightSideDrawer
      visible={false}
      title="Modifier la compétence"
      id="update-skill"
      onCloseDrawer={closeUpdateSkillDrawer}
    >
      {skill ? <SkillForm onSubmit={submitUpdateSkill} skill={skill} /> : null}
    </RightSideDrawer>
  );
};

export default SkillUpdateDrawer;
