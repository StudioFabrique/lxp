/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DatePicker from "../date-picker";
import { useDispatch } from "react-redux";
import { parcoursModulesSliceActions } from "../../../../store/redux-toolkit/parcours/parcours-modules";
import useHttp from "../../../../hooks/use-http";
import Wrapper from "../../../UI/wrapper/wrapper.component";

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
        `La date doit être comprise entre le début (${datesParcours.startDate.toLocaleDateString("fr-FR")}) et la fin (${datesParcours.endDate.toLocaleDateString("fr-FR")}) du parcours`,
      );
    }
    if (newMaxDate && new Date(newMaxDate) > datesParcours.endDate) {
      return setError(
        `La date doit être comprise entre le début (${datesParcours.startDate.toLocaleDateString("fr-FR")}) et la fin (${datesParcours.endDate.toLocaleDateString("fr-FR")}) du parcours`,
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
  };

  const handleSubmit = useCallback(() => {
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
    };

    if (error) return;

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
  }, [
    currentModule?.id,
    datesModule.maxDate,
    datesModule.minDate,
    error,
    dispatch,
    sendRequest,
  ]);

  useEffect(() => {
    setInitDates();
  }, [setInitDates]);

  return (
    <Wrapper>
      {currentModule && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-y-5"
        >
          <span className="flex gap-x-2">
            <h3 className="font-bold">Dates de module</h3>
          </span>

          <div className="flex flex-col lg:flex-row gap-y-5 gap-x-14 justify-end px-5">
            <DatePicker
              id="date1"
              label="Début"
              date={datesModule.minDate}
              onSubmitDate={handleSetDates}
            />

            <DatePicker
              id="date2"
              label="Fin"
              date={datesModule.maxDate}
              onSubmitDate={handleSetDates}
            />
          </div>
          <p className="text-error">{error}</p>
          <button
            disabled={Boolean(error)}
            type="submit"
            className="btn btn-sm w-fit btn-primary self-end"
          >
            Confirmer les dates
          </button>
        </form>
      )}
    </Wrapper>
  );
};

export default CalendarDatesForm;
