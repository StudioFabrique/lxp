import { FC } from "react";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";

type Props = {
  title: string;
  onSubmiSkill: (value: string) => void;
};

const SkillInput: FC<Props> = ({ title, onSubmiSkill }) => {
  const { value: name } = useInput((value) => regexGeneric.test(value), title);

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      if (name.isValid) {
        onSubmiSkill(name.value);
      }
    }
  };

  return (
    <div className="flex-1">
      <input
        className="input input-sm bg-secondary/20 focus:outline-none w-full placeholder:text-base-content"
        type="text"
        defaultValue={name.value}
        onChange={name.valueChangeHandler}
        onBlur={name.valueBlurHandler}
        onKeyUp={handleKeyUp}
        placeholder="AJOUTER UNE NOUVELLE COMPÉTENCE... PUIS TAPER 'ENTRÉE' POUR VALIDER"
      />
    </div>
  );
};

export default SkillInput;
