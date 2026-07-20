import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";

import SkillItem from "./skill-item.component";
import SkillForm from "./skill-form";
import Skill from "../../../../../../src/utils/interfaces/skill";
import FadeWrapper from "../../../../../../src/components/wrappers/FadeWrapper";
import RightSideDrawer from "../../../../../components/UI/right-side-drawer/right-side-drawer";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import { useParcoursSkillMutations, useParcoursSkills } from "../../../hooks/useParcoursSkills";

const SkillsList = () => {
  const { id } = useParams();
  const parcoursId = Number(id);
  const { skills: skillList } = useParcoursSkills(parcoursId);
  const { createSkill, updateSkill, deleteSkill } =
    useParcoursSkillMutations(parcoursId);
  const [itemToUpdate, setItemToUpdate] = useState<Skill | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | undefined>("");
  const [title, setTitle] = useState<string | undefined>("");

  const handleDeleteSkill = (skillId: number) => {
    deleteSkill.mutate(skillId, {
      onError: () => toast.error("Erreur lors de la suppression"),
    });
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
    setItemToUpdate(skillList.find((item: Skill) => item.id === id) ?? null);
    setActiveDrawer("update-skill");
    setTitle("Modifier la compétence");
  };

  const handleSubmitAddSkill = (value: Skill) => {
    const skill = skillList.find(
      (item) => item.description === value.description
    );
    if (!skill) {
      setTimeout(() => {
        createSkill.mutate(value, {
          onSuccess: () =>
            toast.success("Une nouvelle compétence a été enregistrée"),
          onError: () => toast.error("Erreur lors de la création"),
        });
      }, 500);
    } else {
      toast.error("Cette compétence est déjà présente dans la liste");
    }
  };

  const submitUpdateSkill = (skill: Skill) => {
    updateSkill.mutate(skill, {
      onSuccess: (data) => toast.success(data.message),
      onError: () => toast.error("Erreur lors de la mise à jour"),
    });
    handleCloseDrawer("update-skill");
  };

  // Ouvre le drawer quand activeDrawer change
  useEffect(() => {
    if (activeDrawer !== undefined) {
      document.getElementById(activeDrawer)?.click();
    }
  }, [activeDrawer]);

  // Contenu principal du composant
  const content = (
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
