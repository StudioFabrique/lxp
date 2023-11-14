import Wrapper from "../../UI/wrapper/wrapper.component";
import CourseDates from "../../../utils/interfaces/course-dates";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import ButtonAdd from "../../UI/button-add/button-add";
import toast from "react-hot-toast";

interface DatesFormProps {
  isLoading: boolean;
  onSubmitDates: (dates: CourseDates) => void;
}

const DatesForm = (props: DatesFormProps) => {
  const { value: synchrone } = useInput(
    (value) => regexGeneric.test(value),
    "0"
  );
  const { value: asynchrone } = useInput(
    (value) => regexGeneric.test(value),
    "0"
  );
  const { value: startDate } = useInput(
    (value) => regexGeneric.test(value),
    ""
  );
  const { value: endDate } = useInput((value) => regexGeneric.test(value), "");

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "flex-1 input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "flex-1 input input-sm input-bordered focus:outline-none w-full";
  };

  /**
   * vérifie la validité du formulaire et le soumet vers la bdd
   * @param event React.FormEvent
   */
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid()) {
      props.onSubmitDates({
        minDate: startDate.value,
        maxDate: endDate.value,
        synchroneDuration: synchrone.value,
        asynchroneDuration: asynchrone.value,
      });
    } else {
      toast.error(
        "La date de fin ne peut pas être antérieure à la date de début"
      );
    }
  };

  const testDates = () => {
    return (
      new Date(startDate.value).getTime() < new Date(endDate.value).getTime()
    );
  };

  const handleChangeStartDate = (event: React.FormEvent<HTMLInputElement>) => {
    startDate.datePicking(event.currentTarget.value);
  };

  const handleChangeEndDate = (event: React.FormEvent<HTMLInputElement>) => {
    endDate.datePicking(event.currentTarget.value);
  };

  const formIsValid = () => {
    return (
      synchrone.isValid &&
      asynchrone.isValid &&
      startDate.isValid &&
      endDate.isValid &&
      testDates()
    );
  };

  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      onSubmit={handleSubmit}
    >
      <Wrapper>
        <h2 className="text-sm font-bold">Dates de cours *</h2>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
              <p className="whitespace-nowrap w-20">Début</p>
              <input
                className="flex-1 input input-sm input-bordered focus:outline-none w-full"
                name="startingDate"
                type="date"
                value={startDate.value}
                onChange={handleChangeStartDate}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="whitespace-nowrap w-20">Fin</p>
              <input
                className="flex-1 input input-sm input-bordered focus:outline-none w-full"
                name="endingDate"
                type="date"
                value={endDate.value}
                onChange={handleChangeEndDate}
              />
            </div>
          </div>
        </div>
      </Wrapper>
      <Wrapper>
        <h2 className="text-sm font-bold">Durée du cours (nombre d'heures)</h2>
        <div className="flex flex-col gap-y-8">
          <div className="flex justify-between items-center gap-x-4">
            <label className="w-2/6" htmlFor="synchrone">
              Synchrone
            </label>
            <input
              className={setInputStyle(synchrone.hasError)}
              type="number"
              id="synchrone"
              name="synchrone"
              min={0}
              value={synchrone.value}
              onChange={synchrone.valueChangeHandler}
              onBlur={synchrone.valueBlurHandler}
            />
          </div>
          <div className="flex justify-between items-center gap-x-4">
            <label className="w-2/6" htmlFor="asynchrone">
              Asynchrone
            </label>
            <input
              className={setInputStyle(asynchrone.hasError)}
              type="number"
              id="asynchrone"
              name="asynchrone"
              min={0}
              value={asynchrone.value}
              onChange={asynchrone.valueChangeHandler}
              onBlur={asynchrone.valueBlurHandler}
            />
          </div>
        </div>
      </Wrapper>
      <div>
        <ButtonAdd
          label="Ajouter une plage"
          loading={props.isLoading}
          isDisabled={props.isLoading}
          onClickEvent={() => {}}
        />
      </div>
    </form>
  );
};

export default DatesForm;
