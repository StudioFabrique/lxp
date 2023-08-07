import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import SkillForm from "./skill-form";
import Badge from "../../utils/interfaces/badge";
import ButtonAdd from "../UI/button-add/button-add";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";

const SkillsList = () => {
  const skillList = useSelector((state: any) => state.parcoursSkills.skills);
  const dispatch = useDispatch();
  const [itemToUpdate, setItemToUpdate] = useState<any | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");

  const handleDeleteSkill = (skillId: number) => {
    dispatch(parcoursSkillsAction.deleteSkill(skillId));
  };

  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
    setTimeout(() => {
      setItemToUpdate(null);
      setActiveDrawer("");
    }, 500);
  };

  const handleAddSkill = () => {
    setTitle("Ajouter une nouvelle compétence");
    setActiveDrawer("badge-drawer");
  };

  const handleUpdateSkill = (id: number) => {
    setItemToUpdate(skillList.find((item: Skill) => item.id === id));
    setActiveDrawer("update-skill");
    setTitle("Modifier la compétence");
  };

  const handleUpdateBadge = (id: number) => {
    setItemToUpdate(skillList.find((item: Skill) => item.id === id));
    setActiveDrawer("update-badge");
    setTitle("Modifier le Badge");
  };

  const submitNewSkill = (skill: Skill) => {
    dispatch(parcoursSkillsAction.addSkill(skill));
    handleCloseDrawer(activeDrawer!);
  };

  const submitUpdateSkill = (skill: Skill) => {
    dispatch(parcoursSkillsAction.editSkill(skill));
    handleCloseDrawer("update-skill");
  };

  /*   const submitNewBadge = (newBadge: Badge) => {
    if (itemToUpdate) {
      const updatedSkill = { ...itemToUpdate, badge: newBadge };
      dispatch(parcoursSkillsAction.editSkill(updatedSkill));
      handleCloseDrawer("update-badge");
    }
  }; */

  useEffect(() => {
    if (activeDrawer !== undefined) {
      document.getElementById(activeDrawer)?.click();
    }
  }, [activeDrawer]);

  console.log("list rendering");

  let content = (
    <>
      {skillList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {skillList.map((item: Skill) => (
            <li key={item.id}>
              <FadeWrapper>
                <SkillItem
                  skill={item}
                  onUpdateSkill={handleUpdateSkill}
                  onUpdateBadge={handleUpdateBadge}
                  onDeleteSkill={handleDeleteSkill}
                />
              </FadeWrapper>
            </li>
          ))}
        </ul>
      ) : (
        <p>Compétences non renseignées</p>
      )}
    </>
  );

  console.log("rendering");
  /* 
  <ImportButton label="AJOUTER" onClickEvent={handleAddSkill} /> */
  return (
    <>
      <div className="flex flex-col gap-y-4 mt-4">{content}</div>
      <div>
        <ButtonAdd
          label="ajouter"
          outline={true}
          onClickEvent={handleAddSkill}
        />
      </div>

      <RightSideDrawer
        visible={false}
        title={title!}
        id={activeDrawer!}
        onCloseDrawer={handleCloseDrawer}
      >
        {activeDrawer === "badge-drawer" && title && title.length > 0 ? (
          <SkillForm
            onSubmit={submitNewSkill}
            onCloseDrawer={handleCloseDrawer}
          />
        ) : null}

        {activeDrawer === "update-skill" &&
        title &&
        title.length > 0 &&
        itemToUpdate ? (
          <SkillForm
            onSubmit={submitUpdateSkill}
            skill={itemToUpdate}
            onCloseDrawer={handleCloseDrawer}
          />
        ) : null}
      </RightSideDrawer>
    </>
  );
};

export default SkillsList;
