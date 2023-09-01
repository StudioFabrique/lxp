import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  useCallback,
  useEffect,
  useState,
} from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import { useSelector } from "react-redux";
import DatePicker from "./date-picker";

const CalendrierForm: FC<{
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ datesParcours }) => {
  const currentModule: Module | null = useSelector(
    (state: any) => state.parcoursModule.currentModule
  );
  const [datesModule, setDatesModule] = useState<{
    minDate: string;
    maxDate: string;
  }>({ minDate: "", maxDate: "" });

  const initDate = () => {
    setDatesModule({
      minDate: currentModule?.minDate
        ? new Date(currentModule?.minDate).toISOString().split("T")[0]
        : "",
      maxDate: currentModule?.maxDate
        ? new Date(currentModule?.maxDate ?? "").toISOString().split("T")[0]
        : "",
    });
  };

  const handleSubmitDate = (id: string, date: string) => {
    setDatesModule((initialDates) => {
      return {
        minDate: id == "date1" ? date : initialDates.minDate,
        maxDate: id == "date2" ? date : initialDates.maxDate,
      };
    });
  };

  useEffect(() => {
    initDate();
  }, [currentModule]);

  return (
    <Wrapper>
      <p>{`Début du parcours : ${datesParcours.startDate.toLocaleDateString()} Fin du parcours: ${datesParcours.endDate.toLocaleDateString()}`}</p>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <h3>Dates de modules : </h3>
          <div className="flex flex-col gap-y-5">
            <span className="flex items-center gap-x-5">
              <label>Début </label>
              <DatePicker
                id="date1"
                date={datesModule.minDate}
                onSubmitDate={handleSubmitDate}
              />
            </span>
            <span className="flex items-center gap-x-5">
              <label>Fin </label>
              <DatePicker
                id="date2"
                date={datesModule.maxDate}
                onSubmitDate={handleSubmitDate}
              />
            </span>
          </div>
          <p>{`Nombre d'heures du module : ${currentModule.duration} H`}</p>
          <button type="button" className="btn btn-sm self-end">
            Confirmer les dates
          </button>
        </form>
      )}
    </Wrapper>
  );
};

export default CalendrierForm;
