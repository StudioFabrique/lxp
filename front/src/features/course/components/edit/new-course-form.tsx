import useInput from "../../../../hooks/useInput";
import { regexGeneric } from "../../../../config/constantes";
import SubmitButton from "../../../../components/UI/submit-button";

interface NewCourseFormProps {
  moduleAndParcours: boolean;
  label: string;
  isLoading: boolean;
  onSubmit: (title: string) => void;
}

const NewCourseForm = (props: NewCourseFormProps) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));

  console.log(props.moduleAndParcours);

  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.isValid) {
      props.onSubmit(title.value);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-4">
        <label className="font-bold" htmlFor="title">
          {props.label}
        </label>
        <input
          className={setInputStyle(title.hasError)}
          name="title"
          id="title"
          value={title.value}
          onChange={title.valueChangeHandler}
          onBlur={title.valueBlurHandler}
          placeholder="Ex : Création d'un portfolio"
        />
      </div>
      <div className="w-full flex justify-end mt-4">
        <SubmitButton
          disabled={props.moduleAndParcours && title.isValid}
          label="Enregistrement"
          loadingLabel="Enregistrement en Cours"
          isLoading={props.isLoading}
        />
      </div>
    </form>
  );
};

export default NewCourseForm;
