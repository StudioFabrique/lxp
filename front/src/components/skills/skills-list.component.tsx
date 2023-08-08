import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import SkillForm from "./skill-form";
import ButtonAdd from "../UI/button-add/button-add";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import useHttp from "../../hooks/use-http";
import { useParams } from "react-router-dom";
import { autoSubmitTimer } from "../../config/auto-submit-timer";

const SkillsList = () => {
  const { id } = useParams();
  const skillList = useSelector((state: any) => state.parcoursSkills.skills);
  const dispatch = useDispatch();
  const [itemToUpdate, setItemToUpdate] = useState<any | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const { sendRequest } = useHttp();

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

  const handleSubmitAddSkill = (value: any) => {
    if (
      !skillList.find((item: any) => item.description === value.description)
    ) {
      dispatch(
        parcoursSkillsAction.addSkill({
          description: value.description,
          badge: value.badge,
        })
      );
    } else {
      toast.error("Cette compétence est déjà présente dans la liste");
    }
  };

  const submitUpdateSkill = (skill: any) => {
    dispatch(parcoursSkillsAction.editSkill(skill));
    handleCloseDrawer("update-skill");
  };

  useEffect(() => {
    if (activeDrawer !== undefined) {
      document.getElementById(activeDrawer)?.click();
    }
  }, [activeDrawer]);

  console.log({ skillList });

  let content = (
    <>
      {skillList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {skillList.map((item: Skill) => (
            <li key={item.description}>
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

  useEffect(() => {
    const timer = setTimeout(() => {
      const processData = (data: any) => {};
      sendRequest(
        {
          path: "/parcours/update-skills",
          method: "put",
          body: { parcoursId: id, skills: skillList },
        },
        processData
      );
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [id, skillList, dispatch, sendRequest]);

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
            onCloseDrawer={handleCloseDrawer}
            onSubmit={handleSubmitAddSkill}
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
