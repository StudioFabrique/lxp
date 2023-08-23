import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

import SkillItem from "./skill-item.component";
import SkillForm from "./skill-form";
import { parcoursSkillsAction } from "../../../store/redux-toolkit/parcours/parcours-skills";
import useHttp from "../../../hooks/use-http";
import Skill from "../../../utils/interfaces/skill";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";
import ButtonAdd from "../../UI/button-add/button-add";
import RightSideDrawer from "../../UI/right-side-drawer/right-side-drawer";

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
    console.log(
      "update",
      skillList.find((item: Skill) => item.id === id)
    );

    setItemToUpdate(skillList.find((item: Skill) => item.id === id));
    setActiveDrawer("update-skill");
    setTitle("Modifier la compétence");
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
    console.log("skill update", skill);

    dispatch(parcoursSkillsAction.editSkill(skill));
    const processData = (data: { success: boolean; message: string }) => {
      if (data.success) {
        toast.success(data.message);
      }
    };
    sendRequest(
      {
        path: "/bonus-skill",
        method: "put",
        body: {
          skill: {
            id: skill.id,
            description: skill.description,
            badge: skill.badge,
          },
        },
      },
      processData
    );
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
            <li key={item.id}>
              <FadeWrapper>
                <SkillItem
                  skill={item}
                  onUpdateSkill={handleUpdateSkill}
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

      <div className="mt-2">
        <ButtonAdd
          label="Ajouter une compétence"
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
