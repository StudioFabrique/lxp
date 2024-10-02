/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useState } from "react";
import Wrapper from "../../../UI/wrapper/wrapper.component";
import { useSelector } from "react-redux";
import DatePicker from "../date-picker";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../../hooks/use-http";
import { toast } from "react-hot-toast";

const CalendarDatesForm: FC<{
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ datesParcours }) => {
  const dispatch = useDispatch();
  const { sendRequest } = useHttp(true);

  const currentModule = useSelector(
    (state: any) => state.parcoursModules.currentModule,
  );

  const [datesModule, setDatesModule] = useState({
    minDate: currentModule?.minDate
      ? new Date(currentModule.minDate).toISOString().split("T")[0]
      : "",
    maxDate: currentModule?.maxDate
      ? new Date(currentModule.maxDate).toISOString().split("T")[0]
      : "",
  });

  const setDates = useCallback(() => {
    setDatesModule({
      minDate: currentModule?.minDate
        ? new Date(currentModule.minDate).toISOString().split("T")[0]
        : "",
      maxDate: currentModule?.maxDate
        ? new Date(currentModule.maxDate).toISOString().split("T")[0]
        : "",
    });
  }, [currentModule]);

  const handleSubmitDates = (id: string, date: string) => {
    const newMinDate = id === "date1" ? date : datesModule.minDate;
    const newMaxDate = id === "date2" ? date : datesModule.maxDate;

    if (newMinDate && new Date(newMinDate) < datesParcours.startDate) {
      return toast.error(
        "La date doit être comprise entre le début et la fin du parcours",
      );
    }
    if (newMaxDate && new Date(newMaxDate) > datesParcours.endDate) {
      return toast.error(
        "La date doit être comprise entre le début et la fin du parcours",
      );
    }
    if (
      newMinDate &&
      newMaxDate &&
      new Date(newMinDate) > new Date(newMaxDate)
    ) {
      return toast.error(
        "La date minimum ne peut pas être supérieure à la date maximum",
      );
    }

    const applyData = () => {
      dispatch(
        parcoursModulesSliceActions.updateParcoursModule({
          module: {
            minDate: newMinDate,
            maxDate: newMaxDate,
          },
          moduleId: currentModule.id,
        }),
      );
    };

    sendRequest(
      {
        path: "/modules/calendar/dates",
        method: "put",
        body: {
          moduleId: currentModule.id,
          minDate: newMinDate,
          maxDate: newMaxDate,
        },
      },
      applyData,
    );
  };

  useEffect(() => {
    setDates();
  }, [setDates]);

  return (
    <Wrapper>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <h3>Dates de module</h3>
          <div className="flex flex-col gap-y-5">
            <span className="flex">
              <DatePicker
                id="date1"
                label="Début"
                date={datesModule.minDate}
                onSubmitDate={handleSubmitDates}
              />
            </span>
            <span className="flex items-center">
              <DatePicker
                id="date2"
                label="Fin"
                date={datesModule.maxDate}
                onSubmitDate={handleSubmitDates}
              />
            </span>
          </div>
        </form>
      )}
    </Wrapper>
  );
};

export default CalendarDatesForm;
