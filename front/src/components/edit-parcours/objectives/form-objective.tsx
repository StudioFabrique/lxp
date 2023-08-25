import { FC, FormEvent, useState } from "react";

import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import Objective from "../../../utils/interfaces/objective";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DrawerFormButtons from "../../UI/drawer-form-buttons/drawer-form-buttons.component";

type Props = {
  objective?: Objective;
  onCloseDrawer: (id: string) => void;
  onSubmit: (objective: Objective) => void;
};

const FormObjective: FC<Props> = ({ objective, onCloseDrawer, onSubmit }) => {
  const { value: description } = useInput(
    (value) => regexGeneric.test(value),
    objective?.description ?? ""
  );
  const [error, setError] = useState(false);
  //const textAreaRef = useRef<any>(null);

  // test la validité du formulaire
  let formIsValid = description.isValid;

  //console.log(objective?.description);

  /**
   * ferme le drawer lorsqu'on click sur le bouton annuler
   * le drawer est identifié par la présence ou non de la propriété "skill"
   */
  const handleCancel = () => {
    onCloseDrawer(objective ? "update-objective" : "add-objective");
    if (!objective) {
      description.reset();
    }
  };

  /**
   * soumet la nouvelle compétence, reset le formulaire et ferme le drawer
   * @param event FormEvent
   */
  const handleSubmit = (event: FormEvent) => {
    setError(false);
    event.preventDefault();
    if (formIsValid) {
      onSubmit({
        id: objective?.id,
        description: description.value,
      });
      description.reset();
      handleCancel();
    } else {
      setError(true);
    }
  };

  // définit le style du champ du formulaire en fonction de sa validité
  const style = "textarea focus:outline-none bg-secondary/20";
  const textareaStyle = error ? style + " textarea-error" : style;

  return (
    <div className="flex flex-col gap-y-4">
      <form className="flex flex-col px-4 gap-y-4" onSubmit={handleSubmit}>
        <Wrapper>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="description">Objectif de parcours *</label>
            <textarea
              className={textareaStyle}
              value={description.value}
              onChange={description.textAreaChangeHandler}
              onBlur={description.valueBlurHandler}
            />
          </div>
        </Wrapper>
        <DrawerFormButtons onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default FormObjective;
