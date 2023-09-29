import { FC, FormEvent, useCallback, useState } from "react";

import Skill from "../../../utils/interfaces/skill";
import Badge from "../../../utils/interfaces/badge";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import DrawerFormButtons from "../../UI/drawer-form-buttons/drawer-form-buttons.component";
import Wrapper from "../../UI/wrapper/wrapper.component";
import BadgeList from "./badge/badge-list.component";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
  onCloseDrawer: (id: string) => void;
};

const SkillForm: FC<Props> = ({ skill, onSubmit, onCloseDrawer }) => {
  const [badge, setBadge] = useState<Badge | null>(null);

  const { value: description } = useInput(
    (value) => regexGeneric.test(value),
    skill?.description || ""
  );

  const [error, setError] = useState(false);

  /**
   * ferme le drawer lorsqu'on click sur le bouton annuler
   * le drawer est identifié par la présence ou non de la propriété "skill"
   */
  const handleCancel = () => {
    onCloseDrawer(skill ? "update-skill" : "badge-drawer");
    if (!skill) {
      description.reset();
    }
  };

  // test la validité du formulaire
  let formIsValid = description.isValid;

  // définit le style du champ du formulaire en fonction de sa validité
  const style = "textarea focus:outline-none bg-secondary/20";
  const textareaStyle = error ? style + " textarea-error" : style;

  /**
   * ajoute le badge sélectionné lors d'une importation d'image ou d'un click sur un badge dans la liste des badges
   */
  const addBadge = useCallback((newBadge: Badge) => {
    setBadge(newBadge);
  }, []);

  /**
   * soumet la nouvelle compétence, reset le formulaire et ferme le drawer
   * @param event FormEvent
   */
  const handleSubmit = (event: FormEvent) => {
    setError(false);
    event.preventDefault();
    if (formIsValid) {
      onSubmit({
        id: skill?.id,
        description: description.value,
        badge: badge?.image,
        isBonus: skill?.isBonus,
      });
      description.reset();
      onCloseDrawer("badge-drawer");
    } else {
      setError(true);
    }
  };

  console.log({ skill });

  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description">Description de l'objectif *</label>
            <textarea
              className={textareaStyle}
              value={description.value}
              onChange={description.textAreaChangeHandler}
              onBlur={description.valueBlurHandler}
            />
          </div>
        </Wrapper>
        <Wrapper>
          <BadgeList badgeProp={skill?.badge} onSubmitBadge={addBadge} />
        </Wrapper>
        <DrawerFormButtons onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default SkillForm;
