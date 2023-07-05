import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import ImportButton from "./import-button.component";
import SkillForm from "./skill-form";
import Badge from "../../utils/interfaces/badge";
import BadgeUPdate from "../badge/badge-update.component";
import CreateBadge from "../badge/create-badge-drawer";

type Props = {};

const id = "badge-drawer";

const SkillsList: FC<Props> = () => {
  const skillList = useSelector((state: any) => state.parcours.skills);
  const dispatch = useDispatch();
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [isEditingSKill, setIsEditingSkill] = useState(false);
  const [skillToEdit, setSkillToEdit] = useState<Skill | null>(null);
  const [isUpdatingBadge, setIsUpdatingBadge] = useState(false);
  const [badgeToEdit, setBadgeToEdit] = useState<Skill | null>(null);

  const addNewSkill = (skill: Skill) => {
    dispatch(parcoursAction.addSkill(skill));
    closeAddingSkill();
  };

  const openAddingSkill = () => {
    document.getElementById(id)?.click();
    setIsAddingSkill(true);
  };

  const closeAddingSkill = () => {
    document.getElementById(id)?.click();
  };

  const updateSkill = (index: number) => {
    setSkillToEdit(skillList.find((item: Skill) => item.id === index));
  };

  const submitUpdateSkill = (skill: Skill) => {
    dispatch(parcoursAction.editSkill(skill));
    setSkillToEdit(null);
    closeUpdateSkillDrawer("update-skill");
  };

  useEffect(() => {
    if (skillToEdit) {
      setIsEditingSkill(true);
      document.getElementById("update-skill")?.click();
    }
  }, [skillToEdit]);

  const closeUpdateSkillDrawer = (idDrawer: string) => {
    document.getElementById(idDrawer)?.click();
    setSkillToEdit(null);
    setIsEditingSkill(false);
  };

  const updateBadge = (index: number) => {
    const badge = skillList.find((item: Skill) => item.id === index);
    if (badge) {
      setBadgeToEdit(badge);
    }
  };

  useEffect(() => {
    if (badgeToEdit) {
      setIsUpdatingBadge(true);
      document.getElementById("update-badge")?.click();
    }
  }, [badgeToEdit]);

  const submitNewBadge = (newBadge: Badge) => {
    if (badgeToEdit) {
      const updatedSkill = { ...badgeToEdit, badge: newBadge };
      dispatch(parcoursAction.editSkill(updatedSkill));
    }
    closeBadgeUpdateDrawer("update-badge");
  };

  const closeBadgeUpdateDrawer = (idDrawer: string) => {
    document.getElementById(idDrawer)?.click();
    setBadgeToEdit(null);
    setIsUpdatingBadge(false);
  };

  let content = (
    <>
      {skillList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {skillList.map((item: Skill) => (
            <li key={item.id}>
              <SkillItem
                skill={item}
                onUpdateSkill={updateSkill}
                onUpdateBadge={updateBadge}
              />
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
        {isAddingSkill ? <CreateBadge /> : null}
      </RightSideDrawer>

      <RightSideDrawer
        visible={false}
        title="Modifier la compétence"
        id="update-skill"
        onCloseDrawer={closeUpdateSkillDrawer}
      >
        {isEditingSKill && skillToEdit ? (
          <SkillForm onSubmit={submitUpdateSkill} skill={skillToEdit} />
        ) : null}
      </RightSideDrawer>

      <RightSideDrawer
        title="Modifier le Badge de la Compétence"
        id="update-badge"
        visible={false}
        onCloseDrawer={closeBadgeUpdateDrawer}
      >
        {isUpdatingBadge && badgeToEdit && badgeToEdit.badge ? (
          <BadgeUPdate
            badge={badgeToEdit.badge}
            onSubmitNewBadge={submitNewBadge}
          />
        ) : null}
      </RightSideDrawer>
    </>
  );
};

export default SkillsList;
