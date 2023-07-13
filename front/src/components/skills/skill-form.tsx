import { FC, FormEvent, useEffect, useState } from "react";

import Skill from "../../utils/interfaces/skill";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import Badge from "../../utils/interfaces/badge";
import BadgeList from "../badge/badge-list.component";
import Wrapper from "../UI/wrapper/wrapper.component";
import BadgeValidation from "../badge/badge-validation.component";
import { useDispatch, useSelector } from "react-redux";
import { parcoursAction } from "../../store/redux-toolkit/parcours";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";
import CreateBadge from "../badge/create-badge-drawer";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
  onCloseDrawer: (id: string) => void;
};

const SkillForm: FC<Props> = ({ skill, onSubmit, onCloseDrawer }) => {
  const [badge, setBadge] = useState<Badge | undefined>(skill?.badge);
  const totalBadges = useSelector((state: any) => state.parcours.totalBadges);
  const dispatch = useDispatch();

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

  let formIsValid = title.isValid && badge;

  let textareaStyle = () => {
    let style = "textarea focus:outline-none bg-secondary/20";
    return title.hasError ? style + " textarea-error" : style;
  };

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

  useEffect(() => {
    dispatch(parcoursAction.getBadgesTotal());
  }, [dispatch]);

  return (
    <div className="flesx flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="title">Contenu de Compétence *</label>
            <textarea
              className={textareaStyle()}
              value={title.value}
              onChange={title.textAreaChangeHandler}
              onBlur={title.valueBlurHandler}
            />
          </div>
        </Wrapper>

        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <p>Choisir un badge *</p>
            <BadgeList
              onSubmitBadge={handleUpdateBadge}
              selectedBadge={badge}
            />
          </div>
        </Wrapper>

        {badge && !badge.title ? (
          <>
            <div className="divider my-4">Veuillez valider le badge svp</div>
            <BadgeValidation badge={badge} onValidateBadge={validateBadge} />
            <div className="divider my-4" />
          </>
        ) : null}

        <DrawerFormButtons onCancel={handleCancel} />
      </form>
      {totalBadges === 0 ? null : (
        <>
          <div className="divider">Créer un nouveau badge</div>
          <CreateBadge />
        </>
      )}
    </div>
  );
};

export default SkillForm;
