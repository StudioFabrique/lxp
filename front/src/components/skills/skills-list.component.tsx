import { FC } from "react";

import Skill from "../../utils/interfaces/skill";
import SkillItem from "./skill-item.component";
import RightSideDrawer from "../UI/right-side-drawer/right-side-drawer";
import { useSelector } from "react-redux";
import ImportButton from "./import-button.component";

type Props = {};

const id = "badge-drawer";

const SkillsList: FC<Props> = () => {
  const skillList = useSelector((state: any) => state.parcours.skills);

  let content = (
    <>
      {skillList.length > 0 ? (
        <ul className="flex flex-col gap-y-4">
          {skillList.map((item: Skill) => (
            <li key={item.id}>
              <SkillItem skill={item} />
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
      <div className="flex flex-col gap-y-4">{content}</div>
      <ImportButton label="AJOUTER" outline={false} onClickEvent={() => {}} />
      <RightSideDrawer visible={false} title="Choisir un Badge" id={id}>
        <p>TOTO</p>
      </RightSideDrawer>
    </>
  );
};

export default SkillsList;
