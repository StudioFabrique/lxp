import { FC, useEffect, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import Module from "../../../utils/interfaces/module";
import { useSelector } from "react-redux";
import DatePicker from "./date-picker";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceAction } from "../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../hooks/use-http";

const CalendrierForm: FC<{
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ datesParcours }) => {
  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const modules = useSelector((state: any) => state.parcoursModules.modules);

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule
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

  const handleChangeDates = (id: string, date: string) => {
    setDatesModule((initialDates) => {
      return {
        minDate: id === "date1" ? date : initialDates.minDate,
        maxDate: id === "date2" ? date : initialDates.maxDate,
      };
    });
  };

  const handleSubmit = () => {
    const applyData = (data: any) => {
      const newMinDate = data.data.minDate;

      const newMaxDate = data.data.maxDate;

      dispatch(
        parcoursModulesSliceAction.updateParcoursModule({
          module: {
            minDate: newMinDate,
            maxDate: newMaxDate,
          },
          moduleId: currentModule.id,
        })
      );
    };

    sendRequest(
      {
        path: "/module/dates",
        method: "put",
        body: {
          moduleId: currentModule.id,
          minDate: new Date(datesModule.minDate).toISOString(),
          maxDate: new Date(datesModule.maxDate).toISOString(),
        },
      },
      applyData
    );

    dispatch(parcoursModulesSliceAction.clearCurrentParcoursModule());
    console.log(modules);
  };

  useEffect(() => {
    initDate();
  }, [currentModule]);

  return (
    <Wrapper>
      <p>{`Début du parcours : ${datesParcours.startDate.toLocaleDateString()} Fin du parcours: ${datesParcours.endDate.toLocaleDateString()}`}</p>
      {currentModule && (
        <form className="flex flex-col gap-y-5 h-full">
          <h3>Dates de modules : </h3>
          <div className="flex flex-col gap-y-5">
            <span className="flex items-center gap-x-5">
              <label>Début </label>
              <DatePicker
                id="date1"
                date={datesModule.minDate}
                onSubmitDate={handleChangeDates}
              />
            </span>
            <span className="flex items-center gap-x-5">
              <label>Fin </label>
              <DatePicker
                id="date2"
                date={datesModule.maxDate}
                onSubmitDate={handleChangeDates}
              />
            </span>
          </div>
          <p>{`Nombre d'heures du module : ${currentModule.duration} H`}</p>
          <button
            onClick={handleSubmit}
            type="button"
            className="btn btn-sm self-end"
          >
            Confirmer les dates
          </button>
        </form>
      )}
    </Wrapper>
  );
};

export default CalendrierForm;
