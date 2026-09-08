import BoxWrapper from "../../../../../../src/components/wrappers/BoxWrapper";
import CourseDates from "../../../interfaces/course-dates";
import useInput from "../../../../../hooks/useInput";
import { regexGeneric } from "../../../../../config/constantes";
import toast from "react-hot-toast";
import Module from "../../../../../../src/utils/interfaces/module";
import { useEffect, useState } from "react";
import { localeDate } from "../../../../../utils/helpers/locale-date";
import ButtonAdd from "../../../../../components/UI/button-add/button-add";
import DatePicker from "../../../../../components/UI/date-picker/date-picker";
import { formatDateToYYYYMMDD } from "../../../../../utils/helpers/convert-date";

interface DatesFormProps {
  isLoading: boolean;
  module: Module;
  datesList: CourseDates[] | null;
  onSubmitDates: (dates: CourseDates) => void;
}

const DatesForm = (props: DatesFormProps) => {
  const [cumulDurations, setCumulDurations] = useState<number>(0);
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

  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "flex-1 input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "flex-1 input input-sm input-bordered focus:outline-none w-full";
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (formIsValid()) {
      props.onSubmitDates({
        minDate: startDate.value,
        maxDate: endDate.value,
        synchroneDuration: synchrone.value,
        asynchroneDuration: asynchrone.value,
      });
    }
  };

  const testDates = () => {
    return (
      new Date(startDate.value).getTime() <= new Date(endDate.value).getTime()
    );
  };

  const testModuleDates = () => {
    const tmpMinDate = new Date(startDate.value).getTime();
    const tmpMaxDate = new Date(endDate.value).getTime();
    const minModuleDate = new Date(props.module.minDate!).getTime();
    const maxModuleDate = new Date(props.module.maxDate!).getTime();
    console.log(tmpMinDate, tmpMaxDate, minModuleDate, maxModuleDate);
    return (
      tmpMinDate >= minModuleDate &&
      tmpMinDate <= maxModuleDate &&
      tmpMaxDate <= maxModuleDate
    );
  };

  const handleChangeStartDate = (value: string) => {
    startDate.datePicking(value);
  };

  const handleChangeEndDate = (value: string) => {
    endDate.datePicking(value);
  };

  const formIsValid = () => {
    if (
      !(
        synchrone.isValid &&
        asynchrone.isValid &&
        startDate.isValid &&
        endDate.isValid
      )
    ) {
      toast.error("Vérifiez le format des dates et des durées du cours svp.");
      return false;
    }
    if (!testDates()) {
      toast.error(
        "La date de fin ne doit pas être antérieure à la date de début."
      );
      return false;
    } else if (!testModuleDates()) {
      toast.error(
        `Les dates saisies doivent se situer entre le ${localeDate(
          props.module.minDate!
        )} et le ${localeDate(
          props.module.maxDate!
        )}, ce qui correspond à la plage de dates du module.`
      );
      return false;
    } else if (
      +synchrone.value + +asynchrone.value + cumulDurations >
      props.module.duration
    ) {
      toast.error(
        "Le cumul des durées du cours ne doit pas être supérieur à la durée totale du module."
      );
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (props.datesList && props.datesList.length > 0) {
      const duration = props.datesList.reduce((accumulator, date) => {
        return accumulator + +date.asynchroneDuration + +date.synchroneDuration;
      }, 0);
      setCumulDurations(duration);
    }
  }, [props.datesList]);

  console.log(+synchrone.value + +asynchrone.value + cumulDurations);
  console.log(props.module);
  return (
    <form
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      onSubmit={handleSubmit}
    >
      <BoxWrapper>
        <h2 className="text-sm font-bold">Dates de cours *</h2>
        <div className="flex flex-col gap-y-8">
          <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-end gap-4">
              <DatePicker
                id="startingDate"
                name="startingDate"
                label="Début"
                value={startDate.value}
                min={
                  props.module.minDate
                    ? formatDateToYYYYMMDD(new Date(props.module.minDate))
                    : undefined
                }
                max={
                  endDate.value ||
                  (props.module.maxDate
                    ? formatDateToYYYYMMDD(new Date(props.module.maxDate))
                    : undefined)
                }
                onChange={handleChangeStartDate}
              />
            </div>
            <div className="flex justify-between items-end gap-4">
              <DatePicker
                id="endingDate"
                name="endingDate"
                label="Fin"
                value={endDate.value}
                min={
                  startDate.value ||
                  (props.module.minDate
                    ? formatDateToYYYYMMDD(new Date(props.module.minDate))
                    : undefined)
                }
                max={
                  props.module.maxDate
                    ? formatDateToYYYYMMDD(new Date(props.module.maxDate))
                    : undefined
                }
                onChange={handleChangeEndDate}
              />
            </div>
          </div>
        </div>
      </BoxWrapper>
      <BoxWrapper>
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
      </BoxWrapper>
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
