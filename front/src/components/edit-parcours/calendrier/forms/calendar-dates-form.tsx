/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DatePicker from "../date-picker";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../../hooks/use-http";
import useProgressBar from "../../../../hooks/use-progress-bar";
import ProgressBarWrapper from "../../../UI/progress-bar-wrapper/progress-bar-wrapper";

const CalendarDatesForm: FC<{
  datesParcours: { startDate: Date; endDate: Date };
}> = ({ datesParcours }) => {
  const dispatch = useDispatch();
  const { sendRequest } = useHttp(true);
  const [error, setError] = useState<string | null>(null);

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

  const progressBar = useProgressBar(true);

  const setInitDates = useCallback(() => {
    setDatesModule({
      minDate: currentModule?.minDate
        ? new Date(currentModule.minDate).toISOString().split("T")[0]
        : "",
      maxDate: currentModule?.maxDate
        ? new Date(currentModule.maxDate).toISOString().split("T")[0]
        : "",
    });
  }, [currentModule]);

  const handleSetDates = (id: string, date: string) => {
    const newMinDate = id === "date1" ? date : datesModule.minDate;
    const newMaxDate = id === "date2" ? date : datesModule.maxDate;

    setDatesModule({
      minDate: newMinDate,
      maxDate: newMaxDate,
    });

    if (newMinDate && new Date(newMinDate) < datesParcours.startDate) {
      return setError(
        "La date doit être comprise entre le début et la fin du parcours",
      );
    }
    if (newMaxDate && new Date(newMaxDate) > datesParcours.endDate) {
      return setError(
        "La date doit être comprise entre le début et la fin du parcours",
      );
    }
    if (
      newMinDate &&
      newMaxDate &&
      new Date(newMinDate) > new Date(newMaxDate)
    ) {
      return setError(
        "La date minimum ne peut pas être supérieure à la date maximum",
      );
    }
    setError(null);
    progressBar.handlePrepareRequest();
  };

  const handleSubmit = useCallback(() => {
    progressBar.setFetchResultType("loading");
    const applyData = () => {
      dispatch(
        parcoursModulesSliceActions.updateParcoursModule({
          module: {
            minDate: datesModule.minDate,
            maxDate: datesModule.maxDate,
          },
          moduleId: currentModule.id,
        }),
      );
      progressBar.setFetchResultType("success");
    };

    sendRequest(
      {
        path: "/modules/calendar/dates",
        method: "put",
        body: {
          moduleId: currentModule.id,
          minDate: datesModule.minDate,
          maxDate: datesModule.maxDate,
        },
      },
      applyData,
    );
    progressBar.handleStopRequest();
  }, [
    currentModule?.id,
    datesModule.maxDate,
    datesModule.minDate,
    dispatch,
    progressBar,
    sendRequest,
  ]);

  useEffect(() => {
    setInitDates();
  }, [setInitDates]);

  useEffect(() => {
    if (progressBar.canSendRequestNow) {
      handleSubmit();
    }
  }, [progressBar.canSendRequestNow, handleSubmit]);

  return (
    <ProgressBarWrapper loader={progressBar.loader}>
      {currentModule && (
        <form className="flex flex-col gap-y-5">
          <span className="flex gap-x-2">
            <h3>Dates de module</h3>
            {progressBar.componentFetchType()}
          </span>

          <div className="flex flex-col gap-y-5">
            <span className="flex">
              <DatePicker
                id="date1"
                label="Début"
                date={datesModule.minDate}
                onSubmitDate={handleSetDates}
              />
            </span>
            <span className="flex items-center">
              <DatePicker
                id="date2"
                label="Fin"
                date={datesModule.maxDate}
                onSubmitDate={handleSetDates}
              />
            </span>
          </div>
          <p className="text-error">{error}</p>
        </form>
      )}
    </ProgressBarWrapper>
  );
};

export default CalendarDatesForm;
