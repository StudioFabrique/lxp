import { FC } from "react";

import Wrapper from "../UI/wrapper/wrapper.component";
import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import Badge from "../../utils/interfaces/badge";

type Props = {
  badge: any;
  onValidateBadge: (newBadge: Badge) => void;
};

const BadgeValidation: FC<Props> = ({ badge, onValidateBadge }) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));
  const { value: description } = useInput((value) => regexGeneric.test(value));

  let formIsValid = title.isValid && description.isValid;

  const submitBadge = () => {
    if (formIsValid) {
      onValidateBadge({
        ...badge,
        title: title.value,
        description: description.value,
      });
    }
  };

  return (
    <div className="flex flex-col gap-y-4 overflow-y-auto">
      <Wrapper>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title">Nom du Badge *</label>
          <input
            className="input input-group-sm focus:outline-none bg-secondary/20"
            value={title.value}
            onChange={title.valueChangeHandler}
            onBlur={title.valueBlurHandler}
          />
        </div>
      </Wrapper>

      <Wrapper>
        <div className="flex flex-col gap-y-2">
          <label htmlFor="title">Description *</label>
          <textarea
            className="textarea focus:outline-none bg-secondary/20"
            value={description.value}
            onChange={description.textAreaChangeHandler}
            onBlur={description.valueBlurHandler}
          />
        </div>
      </Wrapper>

      <div className="w-full mt-4">
        <button
          className="w-full btn btn-sm btn-primary"
          type="button"
          onClick={submitBadge}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};

export default BadgeValidation;
