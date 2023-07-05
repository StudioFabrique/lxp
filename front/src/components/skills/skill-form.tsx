import { FC, FormEvent, useState } from "react";

import Skill from "../../utils/interfaces/skill";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import { getFixturesBadges } from "../../utils/fixtures/badges";
import badgeImg from "../../assets/images/tmp/badge-react.png";
import Badge from "../../utils/interfaces/badge";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
};

const badges = getFixturesBadges();

const SkillForm: FC<Props> = ({ skill, onSubmit }) => {
  const [badge, setBadge] = useState<Badge | undefined>(skill?.badge);

  const { value: title } = useInput(
    (value) => regexGeneric.test(value),
    skill?.title
  );

  console.log("titre", title.value);
  console.log({ badge });

  let badgeStyle =
    "w-[75px] h-[75px] bg-secondary/20 p-4 rounded-xl flex justify-center items-center hover:scale-105 hover:bg-secondary/50";

  const setBadgeStyle = (badgeId: number) => {
    if (badge) {
      return badgeId === badge.id
        ? badgeStyle + " border border-primary"
        : badgeStyle;
    } else {
      return badgeStyle;
    }
  };

  let badgesContent = (
    <ul className="grid grid-cols-5 gap-x-2 gap-y-2">
      {badges.map((item) => (
        <div
          className="tooltip hover:tooltip-open tooltip-bottom"
          data-tip={item.title}
        >
          <li key={item.id} onClick={() => handleUpdateBadge(item)}>
            <div className={setBadgeStyle(item.id)}>
              <img className="w-8 h-8" src={badgeImg} alt={item.title} />
            </div>
          </li>
        </div>
      ))}
      <div
        className="tooltip hover:tooltip-open tooltip-bottom"
        data-tip="Ajouter un nouveau badge"
      >
        <li key="add-badge">
          <div className={badgeStyle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </li>
      </div>
    </ul>
  );

  let formIsValid = title.isValid && badge;

  const handleUpdateBadge = (newBadge: Badge) => {
    setBadge(newBadge);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      console.log(title.value);
      console.log(badge);
      onSubmit({ title: title.value, badge });
      title.reset();
      setBadge(undefined);
    } else {
      console.log("oops");
    }
  };

  return (
    <form className="flex flex-col px-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-2">
        <label htmlFor="title">Contenu de compétence *</label>
        <textarea
          className="textarea focus:outline-none bg-secondary/20"
          defaultValue={title.value}
          onChange={title.textAreaChangeHandler}
          onBlur={title.valueBlurHandler}
        />
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-y-4">
        <p>Choisir un badge de compétence</p>
        <div>{badgesContent}</div>
      </div>
      <div className="w-full flex justify-end mt-8">
        <div className="flex gap-x-4">
          <button
            className="btn btn-outline btn-sm btn-primary font-normal w-32"
            type="reset"
            onClick={() => {}}
          >
            Annuler
          </button>
          <button className="btn btn-primary btn-sm w-32">Valider</button>
        </div>
      </div>
    </form>
  );
};

export default SkillForm;
