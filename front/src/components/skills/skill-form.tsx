import { FC, useState } from "react";

import Skill from "../../utils/interfaces/skill";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import { getFixturesBadges } from "../../utils/fixtures/badges";
import badgeImg from "../../assets/images/tmp/badge-react.png";
import Badge from "../../utils/interfaces/badge";

type Props = {
  skill?: Skill;
};

const badges = getFixturesBadges();

const SkillForm: FC<Props> = ({ skill }) => {
  const [badge, setBadge] = useState<Badge | null>(null);

  const { value: title } = useInput(
    (value) => regexGeneric.test(value),
    skill?.title
  );

  let badgesContent = (
    <ul className="flex gap-x-2 gap-y-2 flex-wrap">
      {badges.map((item) => (
        <li key={item.id}>
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src={badgeImg} alt={item.title} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <form>
      <div className="flex flex-col gap-y-1">
        <label htmlFor="title">Titre</label>
        <input
          className="input input-sm focus:outline-none"
          type="text"
          defaultValue={title.value}
          onChange={title.valueChangeHandler}
          onBlur={title.valueBlurHandler}
        />
      </div>
      <div className="divider" />
      {badgesContent}
    </form>
  );
};

export default SkillForm;
