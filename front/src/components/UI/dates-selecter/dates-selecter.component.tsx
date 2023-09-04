import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { formatDateToYYYYMMDD } from "../../../helpers/convert-date";

type Props = {
  onSubmitDates: (dates: { startDate: string; endDate: string }) => void;
  label?: string; // titre du composant personnalisable
  startDateProp?: string;
  endDateProp?: string;
};

const DatesSelecter: FC<Props> = ({
  startDateProp = "",
  endDateProp = "",
  label = "Dates",
  onSubmitDates,
}) => {
  const { value: startDate } = useInput(
    (value) => regexGeneric.test(value),
    startDateProp ? formatDateToYYYYMMDD(new Date(startDateProp)) : ""
  );
  const { value: endDate } = useInput(
    (value) => regexGeneric.test(value),
    endDateProp ? formatDateToYYYYMMDD(new Date(endDateProp)) : ""
  );
  const [error, setError] = useState(false);
  const isInitialRender = useRef(true);

  const dates = useMemo(() => {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
    };
  }, [startDate.value, endDate.value]);

  /**
   * vérification de la validité des dates et envoie des données au composant parent pour les mettre à jour dans le state global et la bdd
   */
  useEffect(() => {
    setError(false);
    const timer = setTimeout(() => {
      const date = new Date().getTime();
      const sDate = new Date(dates.startDate).getTime();
      const eDate = new Date(dates.endDate).getTime();
      if (startDate.isValid && endDate.isValid) {
        /* if (sDate > date && sDate < eDate) { */
        if (!isInitialRender.current) {
          onSubmitDates(dates);
        } else {
          isInitialRender.current = false;
        }
        /* } else {
          setError(true);
        } */
      }
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [dates, startDate.isValid, endDate.isValid, onSubmitDates]);

  const handleChangeStartDate = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      startDate.datePicking(event.currentTarget.value);
      isInitialRender.current = false;
    },
    [startDate]
  );

  const handleChangeEndDate = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      endDate.datePicking(event.currentTarget.value);
      isInitialRender.current = false;
    },
    [endDate]
  );

  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="font-bold">{label}</h3>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <p>Début *</p>
          <input
            className="ml-2 input input-sm w-5/6"
            name="startingDate"
            type="date"
            value={startDate.value}
            onChange={handleChangeStartDate}
          />
        </div>
        <div className="flex justify-between items-center">
          <p>Fin *</p>
          <input
            className="ml-2 input input-sm w-5/6"
            name="endingDate"
            type="date"
            value={endDate.value}
            onChange={handleChangeEndDate}
          />
        </div>
      </div>
      {error ? (
        <p className="text-base-content text-xs mt-4 text-center font-bold">
          La date de début doit être comprise entre aujourd'hui et la date de
          fin de la formation
        </p>
      ) : null}
    </div>
  );
};

export default DatesSelecter;
