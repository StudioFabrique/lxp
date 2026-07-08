/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router";
import { useParcoursSelector, useParcoursDispatch } from "../../../store/ParcoursContext";

import SkillItem from "./skill-item.component";
import SkillForm from "./skill-form";
import useHttp from "../../../../../../src/hooks/useHttp";
import Skill from "../../../../../../src/utils/interfaces/skill";
import FadeWrapper from "../../../../../../src.legacy/components/UI/fade-wrapper/fade-wrapper";
import ButtonAdd from "../../../../../../src.legacy/components/UI/button-add/button-add";
import RightSideDrawer from "../../../../../../src.legacy/components/UI/right-side-drawer/right-side-drawer";

/**
 * Composant qui gère l'affichage et la gestion de la liste des compétences
 */
const SkillsList = () => {
  // Récupération de l'ID du parcours depuis l'URL
  const { id } = useParams();
  // Récupération de la liste des compétences depuis le state
  const skillList = useParcoursSelector((state) => state.parcoursSkills.skills);
  const dispatch = useParcoursDispatch();
  // État local pour la compétence à mettre à jour
  const [itemToUpdate, setItemToUpdate] = useState<any | null>(null);
  // État local pour gérer l'affichage du drawer
  const [activeDrawer, setActiveDrawer] = useState<string | undefined>("");
  // État local pour le titre du drawer
  const [title, setTitle] = useState<string | undefined>("");
  // Hook personnalisé pour les requêtes HTTP
  const { sendRequest, error } = useHttp();

  /**
   * Gère la suppression d'une compétence
   * @param skillId ID de la compétence à supprimer
   */
  const handleDeleteSkill = (skillId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const processData = (_data: any) => {
      dispatch({ type: "DELETE_SKILL", payload: skillId });
    };
    sendRequest(
      {
        path: `/bonus-skill/${skillId}`,
        method: "delete",
      },
      processData
    );
  };

  // Affiche les erreurs via toast si présentes
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  /**
   * Ferme le drawer et réinitialise les états
   * @param id ID du drawer à fermer
   */
  const handleCloseDrawer = (id: string) => {
    document.getElementById(id)?.click();
    setTimeout(() => {
      setItemToUpdate(null);
      setActiveDrawer("");
    }, 500);
  };

  /**
   * Configure le drawer pour l'ajout d'une nouvelle compétence
   */
  const handleAddSkill = () => {
    setTitle("Ajouter une nouvelle compétence");
    setActiveDrawer("badge-drawer");
  };

  /**
   * Configure le drawer pour la mise à jour d'une compétence
   * @param id ID de la compétence à mettre à jour
   */
  const handleUpdateSkill = (id: number) => {
    console.log(
      "update",
      skillList.find((item: Skill) => item.id === id)
    );

    setItemToUpdate(skillList.find((item: Skill) => item.id === id));
    setActiveDrawer("update-skill");
    setTitle("Modifier la compétence");
  };

  /**
   * Gère la soumission du formulaire d'ajout de compétence
   * @param value Données de la nouvelle compétence
   */
  const handleSubmitAddSkill = (value: any) => {
    const skill = skillList.find(
      (item: any) => item.description === value.description
    );
    if (!skill) {
      const processData = (data: any) => {
        if (data.success) {
          toast.success("Une nouvelle compétence a été enregistrée");
          dispatch({ type: "ADD_SKILL", payload: data.skill });
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

  /**
   * Gère la soumission du formulaire de mise à jour d'une compétence
   * @param skill Données de la compétence mise à jour
   */
  const submitUpdateSkill = (skill: any) => {
    console.log("skill update", skill);

    dispatch({ type: "EDIT_SKILL", payload: skill });
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
