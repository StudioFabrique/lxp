import { FC, useEffect, useRef, useState } from "react";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import { useDispatch, useSelector } from "react-redux";
import ImportButton from "./import-button.component";
import SkillForm from "./skill-form";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

type Props = {};

const id = "badge-drawer";

const SkillsList: FC<Props> = () => {
  const skillList = useSelector((state: any) => state.parcours.skills);
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditingSKill, setIsEditingSkill] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const addNewSkill = (skill: Skill) => {
    dispatch(parcoursAction.addSkill(skill));
  };
  const drawerRef = useRef<any>(null);

  const updateSkill = (index: number) => {
    setSkillToEdit(skillList.find((item: Skill) => item.id === index));
  };

  useEffect(() => {
    if (skillToEdit) {
      document.getElementById("update-skill")?.click();
      setIsEditingSkill(true);
    } else {
      setIsEditingSkill(false);
      document.getElementById("update-skill")?.click();
    }
  }, [skillToEdit]);

  const submitUpdateSkill = () => {
    setSkillToEdit(null);
  };

  const openAddingSkill = () => {
    document.getElementById(id)?.click();
    setIsDrawerOpen(true);
  };

  const closeAddingSkill = () => {
    document.getElementById(id)?.click();
    setIsDrawerOpen(false);
  };

  const closeEditingSkill = () => {};

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
        {isDrawerOpen ? (
          <SkillForm onCloseDrawer={closeAddingSkill} onSubmit={addNewSkill} />
        ) : null}
      </RightSideDrawer>
      <RightSideDrawer
        visible={false}
        title="Modifier la compétence"
        id="update-skill"
      >
        {isEditingSKill && skillToEdit ? (
          <SkillForm
            onCloseDrawer={closeEditingSkill}
            onSubmit={submitUpdateSkill}
            skill={skillToEdit}
          />
        ) : null}
      </RightSideDrawer>
    </>
  );
};

export default SkillsList;
