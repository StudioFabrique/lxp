import { FC } from "react";

import Skill from "../../utils/interfaces/skill";
import SkillTitle from "./skill-title.component";

type Props = {
  skill: Skill;
};

const SkillItem: FC<Props> = ({ skill }) => {
  return (
    <>
      <div className="w-full flex gap-x-4">
        <SkillTitle title={skill.title} />
      </div>
    </>
  );
};

export default SkillItem;
