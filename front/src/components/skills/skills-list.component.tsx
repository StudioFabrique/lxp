import { FC, useState } from "react";
import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import ImportButton from "./import-button.component";
import { sortArray } from "../../utils/sortArray";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";

type Props = {};

let index = 0;
const id = "badge-drawer";

const SkillsList: FC<Props> = () => {
  //  Liste des compétences
  const [dataList, setDataList] = useState<Array<Skill>>([]);
  //  Gère l'affichage de l'input pour ajouter une nouvelle compétence
  const [isEditing, setIsEditing] = useState(false);

  //  Mise à jour d'une compétence
  const handleUpdateSkill = (updatedSkill: Skill) => {
    const updatedSkills = dataList.filter(
      (item) => item.id !== updatedSkill.id
    );
    updatedSkills.push(updatedSkill);
    sortArray(updatedSkills, "id");
    setDataList(updatedSkills);
  };

  const handleOpenBadgeDrawer = () => {
    document.getElementById(id)?.click();
  };

  //  Suppression d'une compétence
  const handleDeleteSkill = (skillId: number) => {
    const updatedSkills = dataList.filter((item) => item.id !== skillId);
    setDataList(updatedSkills);
  };

  if (dataList.length > 0) {
    dataList.forEach((item) => {
      if (!item.id) {
        index++;
        item.id = index;
      }
    });
  }

  let content = (
    <>
      {dataList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {dataList.map((item: Skill) => (
            <li key={item.id}>
              <SkillItem
                skill={item}
                onBadgeSelect={handleOpenBadgeDrawer}
                onSubmitSkill={handleUpdateSkill}
                onDeleteSkill={handleDeleteSkill}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>Compétences non renseignées</p>
      )}
    </>
  );

  const handleClickEvent = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleSubmitNewSkill = (newSkill: Skill) => {
    setDataList((prevDataList: Array<Skill>) => [...prevDataList, newSkill]);
    handleClickEvent();
  };

  console.log({ dataList });

  return (
    <>
      <div className="flex flex-col gap-y-4">
        {content}
        <>
          {isEditing ? (
            <SkillItem
              onDeleteSkill={() => {}}
              onSubmitSkill={handleSubmitNewSkill}
              onBadgeSelect={handleOpenBadgeDrawer}
            />
          ) : (
            <ImportButton
              label="AJOUTER"
              outline={false}
              onClickEvent={handleClickEvent}
            />
          )}
        </>
      </div>
      <RightSideDrawer visible={false} title="Choisir un Badge" id={id}>
        <p>TOTO</p>
      </RightSideDrawer>
    </>
  );
};

export default SkillsList;
