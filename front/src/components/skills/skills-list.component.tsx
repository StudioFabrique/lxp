import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import ImportButton from "./import-button.component";
import SkillForm from "./skill-form";

type Props = {};

const id = "badge-drawer";

const SkillsList: FC<Props> = () => {
  const skillList = useSelector((state: any) => state.parcours.skills);
  const dispatch = useDispatch();
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isEditingSKill, setIsEditingSkill] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);

  const addNewSkill = (skill: Skill) => {
    dispatch(parcoursAction.addSkill(skill));
    closeAddingSkill();
  };

  const updateSkill = (index: number) => {
    setSkillToEdit(skillList.find((item: Skill) => item.id === index));
  };

  useEffect(() => {
    if (skillToEdit) {
      setIsEditingSkill(true);
      document.getElementById("update-skill")?.click();
    }
  }, [skillToEdit]);

  const submitUpdateSkill = () => {
    setSkillToEdit(null);
    handleCloseUpdateDrawer("update-skill");
  };

  const openAddingSkill = () => {
    document.getElementById(id)?.click();
    setIsAddingSkill(true);
  };

  const closeAddingSkill = () => {
    document.getElementById(id)?.click();
  };

  const handleCloseUpdateDrawer = (idDrawer: string) => {
    document.getElementById(idDrawer)?.click();
    setSkillToEdit(null);
    setIsEditingSkill(false);
  };

  let content = (
    <>
      {skillList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {skillList.map((item: Skill) => (
            <li key={item.id}>
              <SkillItem skill={item} onUpdateSkill={updateSkill} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Compétences non renseignées</p>
      )}
    </>
  );

  return (
    <>
      <div className="flex flex-col gap-y-4 mt-4">{content}</div>
      <ImportButton
        label="AJOUTER"
        outline={false}
        onClickEvent={openAddingSkill}
      />
      <RightSideDrawer
        visible={false}
        title="Ajouter une nouvelle compétence"
        id={id}
      >
        {isAddingSkill ? <SkillForm onSubmit={addNewSkill} /> : null}
      </RightSideDrawer>
      <RightSideDrawer
        visible={false}
        title="Modifier la compétence"
        id="update-skill"
        onCloseDrawer={handleCloseUpdateDrawer}
      >
        {isEditingSKill && skillToEdit ? (
          <SkillForm onSubmit={submitUpdateSkill} skill={skillToEdit} />
        ) : null}
      </RightSideDrawer>
    </>
  );
};

export default SkillsList;
