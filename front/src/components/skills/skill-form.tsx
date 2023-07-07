import { FC, FormEvent, useState } from "react";

import Skill from "../../utils/interfaces/skill";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import Badge from "../../utils/interfaces/badge";
import BadgeList from "../badge/badge-list.component";
import CreateBadge from "../badge/create-badge-drawer";
import Wrapper from "../UI/wrapper/wrapper.component";
import BadgeValidation from "../badge/badge-validation.component";
import { useDispatch } from "react-redux";
import { parcoursAction } from "../../store/redux-toolkit/parcours";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
  onCloseDrawer: (id: string) => void;
};

const SkillForm: FC<Props> = ({ skill, onSubmit, onCloseDrawer }) => {
  const [badge, setBadge] = useState<Badge | undefined>(skill?.badge);
  const dispatch = useDispatch();

  console.log({ badge });

  const { value: title } = useInput(
    (value) => regexGeneric.test(value),
    skill?.title || ""
  );

  const handleUpdateBadge = (newBadge: any) => {
    setBadge(newBadge);
  };

  const handleCancel = () => {
    onCloseDrawer(skill ? "update-skill" : "badge-drawer");
    if (!skill) {
      setBadge(undefined);
      title.reset();
    }
  };

  let badgesContent = (
    <BadgeList onSubmitBadge={handleUpdateBadge} selectedBadge={badge} />
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

  const validateBadge = (newBadge: Badge) => {
    dispatch(parcoursAction.validateBadge(newBadge));
    setBadge(newBadge);
  };

  return (
    <div className="flesx flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="title">Contenu de Compétence *</label>
            <textarea
              className="textarea focus:outline-none bg-secondary/20"
              value={title.value}
              onChange={title.textAreaChangeHandler}
              onBlur={title.valueBlurHandler}
            />
          </div>
        </Wrapper>

        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <p>Choisir un badge *</p>
            {badgesContent}
          </div>
        </Wrapper>

        {badge && !badge.title ? (
          <>
            <div className="divider my-4">Veuillez valider le badge svp</div>
            <BadgeValidation badge={badge} onValidateBadge={validateBadge} />
            <div className="divider my-4" />
          </>
        ) : null}

        <div className="w-full flex justify-between mt-4">
          <button
            className="btn btn-outline btn-sm btn-primary font-normal w-32"
            type="reset"
            onClick={handleCancel}
          >
            Annuler
          </button>
          <button className="btn btn-primary btn-sm w-32">Valider</button>
        </div>
      </form>
      <div className="divider my-8">Créer un nouveau badge svp</div>
      <CreateBadge />
    </div>
  );
};

export default SkillForm;
