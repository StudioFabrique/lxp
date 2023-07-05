import { FC, FormEvent, useState } from "react";
import { useSelector } from "react-redux";

import Skill from "../../utils/interfaces/skill";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import Badge from "../../utils/interfaces/badge";
import BadgeList from "../badge/badge-list.component";
import CreateBadgeDrawer from "../badge/create-badge-drawer";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
};

const SkillForm: FC<Props> = ({ skill, onSubmit }) => {
  const badges = useSelector((state: any) => state.parcours.badges);
  const [badge, setBadge] = useState<Badge | undefined>(skill?.badge);

  const { value: title } = useInput(
    (value) => regexGeneric.test(value),
    skill?.title || ""
  );

  const handleUpdateBadge = (newBadge: Badge) => {
    setBadge(newBadge);
  };

  const createBadge = () => {
    document.getElementById("create-badge")?.click();
  };

  let badgesContent = (
    <BadgeList
      badgeList={badges}
      onSubmitBadge={handleUpdateBadge}
      selectedBadge={badge}
      onCreateBadge={createBadge}
    />
  );

  let formIsValid = title.isValid && badge;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      onSubmit({ title: title.value, badge, id: skill?.id });
      title.reset();
      setBadge(undefined);
    } else {
      console.log("oops");
    }
  };

  return (
    <>
      <form className="flex flex-col px-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title">Contenu de compétence *</label>
          <textarea
            className="textarea focus:outline-none bg-secondary/20"
            value={title.value}
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
    </>
  );
};

export default SkillForm;
