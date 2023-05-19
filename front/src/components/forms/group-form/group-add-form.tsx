import { FC, FormEvent } from "react";
import { LoadingButton } from "../../UI/loading-button/loading-button.component";
import { regexGeneric } from "../../../utils/constantes";
import useInput from "../../../hooks/use-input";

const GroupAddForm: FC<{
  group?: any;
  onSubmitForm: (group: any) => void;
  error: string;
  isLoading: boolean;
}> = (props) => {
  const { value: name } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.name ?? ""
  );

  const { value: desc } = useInput(
    (value: string) => regexGeneric.test(value),
    props.group?.desc ?? ""
  );

  //  test la validité du form via le custom hook useInput
  let formIsValid = false;
  formIsValid = name.isValid && desc.isValid;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formIsValid) {
      props.onSubmitForm({
        name: name.value.trim(),
        desc: desc.value.trim(),
      });
    }
  };

  return (
    <form
      className="flex flex-col items-center gap-y-6"
      onSubmit={handleSubmit}
      autoComplete="off"
    >
      <div className="h-full flex flex-col justify-center gap-y-4">
        <span className="flex flex-col justify-between">
          <label>Nom du groupe</label>
          <input
            className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
            type="text"
            onChange={name.valueChangeHandler}
            onBlur={name.valueBlurHandler}
            defaultValue={name.value}
            autoComplete="off"
          />
        </span>
        <span className="flex flex-col justify-between">
          <label>Description</label>
          <input
            className="ml-2 rounded-xs bg-pink-900/10 outline-pink-900/20 p-[20px] pl-[30px] placeholder:text-purple-discrete"
            type="text"
            onChange={desc.valueChangeHandler}
            onBlur={desc.valueBlurHandler}
            defaultValue={desc.value}
            autoComplete="off"
          />
        </span>
      </div>

      <div className="h-full flex flex-col justify-center">
        <p>{props.error}</p>
        <LoadingButton
          isLoading={props.isLoading}
          error={props.error}
          label="Enregistrer"
          loadingLabel="Enregistrement en cours"
        />
      </div>
    </form>
  );
};

export default GroupAddForm;
