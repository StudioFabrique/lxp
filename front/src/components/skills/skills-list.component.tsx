import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import SkillForm from "./skill-form";
import ButtonAdd from "../UI/button-add/button-add";
import FadeWrapper from "../UI/fade-wrapper/fade-wrapper";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import useHttp from "../../hooks/use-http";

const SkillsList = () => {
  const { id } = useParams();
  const skillList = useSelector((state: any) => state.parcoursSkills.skills);
  const dispatch = useDispatch();
  const [itemToUpdate, setItemToUpdate] = useState<any | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");
  const { sendRequest } = useHttp();

  const handleDeleteSkill = (skillId: number) => {
    const processData = (data: any) => {
      console.log(data);
      dispatch(parcoursSkillsAction.deleteSkill(skillId));
    };
    sendRequest(
      {
        path: `/bonus-skill/${skillId}`,
        method: "delete",
      },
      processData
    );
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
    const skill = skillList.find(
      (item: any) => item.description === value.description
    );
    if (!skill) {
      const processData = (data: any) => {
        if (data.success) {
          toast.success("Une nouvelle compétence a été enregistrée");
          dispatch(parcoursSkillsAction.addSkill(data.skill));
          dispatch(parcoursSkillsAction.unselectBadge());
        }
      };
      setTimeout(() => {
        sendRequest(
          {
            path: "/bonus-skill",
            method: "post",
            body: {
              parcoursId: id,
              skill: {
                description: value.description,
                badge: value.badge,
              },
            },
          },
          processData
        );
      }, 500);
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

  return (
    <>
      <FadeWrapper>
        <div className="w-full flex flex-col gap-y-4 mt-4">{content}</div>
      </FadeWrapper>

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
