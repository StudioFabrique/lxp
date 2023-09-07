import { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import Module from "../../../../utils/interfaces/module";
import { useSelector } from "react-redux";
import DatePicker from "../date-picker";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../../hooks/use-http";

const CalendrierDatesForm: FC<{
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ datesParcours }) => {
  const dispatch = useDispatch();

  const { sendRequest } = useHttp();

  const currentModule: Module = useSelector(
    (state: any) => state.parcoursModules.currentModule
  );

  const [datesModule, setDatesModule] = useState({
    minDate: "",
    maxDate: "",
    initial: true,
  });

  const initDate = useCallback(() => {
    if (datesModule.initial) {
      setDatesModule({
        minDate: currentModule?.minDate
          ? new Date(currentModule?.minDate).toISOString().split("T")[0]
          : "",
        maxDate: currentModule?.maxDate
          ? new Date(currentModule?.maxDate ?? "").toISOString().split("T")[0]
          : "",
        initial: false,
      });
    }
  }, [currentModule?.minDate, currentModule?.maxDate, datesModule.initial]);

  const handleSubmit = () => {
    const applyData = (data: any) => {
      const newMinDate = data.data.minDate;

      const newMaxDate = data.data.maxDate;

      dispatch(
        parcoursModulesSliceActions.updateParcoursModule({
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
  };

  const handleChangeDates = (id: string, date: string) => {
    setDatesModule((initialDates) => {
      return {
        minDate: id === "date1" ? date : initialDates.minDate,
        maxDate: id === "date2" ? date : initialDates.maxDate,
        initial: initialDates.initial,
      };
    });

    handleSubmit();
  };

  useEffect(() => {
    initDate();
  }, [initDate]);

  return (
    <Wrapper>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <h3>Dates de module *</h3>
          <div className="flex flex-col gap-y-5">
            <span className="flex items-center">
              <DatePicker
                id="date1"
                label="Début"
                date={datesModule.minDate}
                onSubmitDate={handleChangeDates}
              />
            </span>
            <span className="flex items-center">
              <DatePicker
                id="date2"
                label="Fin"
                date={datesModule.maxDate}
                onSubmitDate={handleChangeDates}
              />
            </span>
          </div>
        </form>
      )}
    </Wrapper>
  );
};

export default CalendrierDatesForm;
