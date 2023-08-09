import { FC, FormEvent, useCallback, useEffect, useState } from "react";

import Skill from "../../utils/interfaces/skill";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import BadgeList from "../badge/badge-list.component";
import Wrapper from "../UI/wrapper/wrapper.component";
import { useDispatch, useSelector } from "react-redux";
import DrawerFormButtons from "../UI/drawer-form-buttons/drawer-form-buttons.component";
import { parcoursSkillsAction } from "../../store/redux-toolkit/parcours/parcours-skills";
import Badge from "../../utils/interfaces/badge";

type Props = {
  skill?: Skill;
  onSubmit: (skill: Skill) => void;
  onCloseDrawer: (id: string) => void;
};

const SkillForm: FC<Props> = ({ skill, onSubmit, onCloseDrawer }) => {
  const dispatch = useDispatch();
  const [badge, setBadge] = useState<Badge | null>(null);

  const { value: description } = useInput(
    (value) => regexGeneric.test(value),
    skill?.description || ""
  );

  const handleCancel = () => {
    onCloseDrawer(skill ? "update-skill" : "badge-drawer");
    if (!skill) {
      description.reset();
    }
  };

  let formIsValid = description.isValid;

  let textareaStyle = () => {
    let style = "textarea focus:outline-none bg-secondary/20";
    return description.hasError ? style + " textarea-error" : style;
  };

  const addBadge = useCallback((newBadge: Badge) => {
    setBadge(newBadge);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (formIsValid) {
      onSubmit({
        description: description.value,
        badge: badge?.image,
      });
      description.reset();
      onCloseDrawer("badge-drawer");
    }
  };

  useEffect(() => {
    dispatch(parcoursSkillsAction.getBadgesTotal());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description">Contenu de Compétence *</label>
            <textarea
              className={textareaStyle()}
              value={description.value}
              onChange={description.textAreaChangeHandler}
              onBlur={description.valueBlurHandler}
            />
          </div>
        </Wrapper>
        <Wrapper>
          <BadgeList onSubmitBadge={addBadge} />
        </Wrapper>
        <DrawerFormButtons onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default SkillForm;
