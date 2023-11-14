import useInput from "../../hooks/use-input";
import { regexGeneric } from "../../utils/constantes";
import SubmitButton from "../UI/submit-button";

interface NewCourseFormProps {
  isLoading: boolean;
  onSubmit: (title: string) => void;
}

const NewCourseForm = (props: NewCourseFormProps) => {
  const { value: title } = useInput((value) => regexGeneric.test(value));

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "input input-sm input-bordered focus:outline-none w-full";
  };

  /**
   * validation et soummission du formulaire
   * @param event React.FormEvent
   */
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
          Titre du cours
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
          label="Enregistrement"
          loadingLabel="Enregistrement en Cours"
          isLoading={props.isLoading}
        />
      </div>
    </form>
  );
};

export default NewCourseForm;
