import { FC, useCallback, useEffect, useMemo, useState } from "react";

import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import { formatDateToYYYYMMDD } from "../../../helpers/convert-date";
import DatePicker from "../../edit-parcours/calendrier/date-picker";

type Props = {
  onSubmitDates: (dates: { startDate: string; endDate: string }) => void;
  label?: string; // titre du composant personnalisable
  startDateProp?: string;
  endDateProp?: string;
};

const DatesSelecter: FC<Props> = ({
  startDateProp = "",
  endDateProp = "",
  label = "",
  onSubmitDates,
}) => {
  const tommorowDate = new Date(new Date().setDate(new Date().getDate() + 1));

  const { value: startDate } = useInput(
    (value) => regexGeneric.test(value),
    startDateProp
      ? formatDateToYYYYMMDD(new Date(startDateProp))
      : formatDateToYYYYMMDD(tommorowDate),
  );
  const { value: endDate } = useInput(
    (value) => regexGeneric.test(value),
    endDateProp
      ? formatDateToYYYYMMDD(new Date(endDateProp))
      : formatDateToYYYYMMDD(tommorowDate),
  );
  const [error, setError] = useState(false);
  const [submit, setSubmit] = useState<boolean>(false);

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
    const timer = setTimeout(() => {
      if (submit) {
        const sDate = new Date(startDate.value).getTime();
        const eDate = new Date(endDate.value).getTime();

        if (startDate.isValid && endDate.isValid) {
          setError(false);
          if (sDate < eDate) {
            onSubmitDates(dates);
            setSubmit(false);
          } else {
            setError(true);
            setSubmit(false);
          }
        }
      }
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [
    dates,
    startDate.isValid,
    startDate.value,
    submit,
    endDate.isValid,
    endDate.value,
    onSubmitDates,
  ]);

  const handleChangeStartDate = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      startDate.datePicking(event.currentTarget.value);
      setSubmit(true);
    },
    [startDate],
  );

  const handleChangeEndDate = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      endDate.datePicking(event.currentTarget.value);
      setSubmit(true);
    },
    [endDate],
  );
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="font-bold">{label}</h3>
      <div className="flex flex-col gap-y-4">
        {/* <div className="flex justify-between items-center">
          <p className="whitespace-nowrap w-20">Début</p>
          <input
            className="ml-2 input input-sm w-5/6"
            name="startingDate"
            type="date"
            value={dates.startDate}
            onChange={handleChangeStartDate}
          />
        </div> */}
        <DatePicker
          id="date1"
          name="startingDate"
          label="Début"
          date={dates.startDate}
          onChangeDate={handleChangeStartDate}
        />
        <DatePicker
          id="date2"
          name="startingDate"
          label="Fin"
          date={dates.endDate}
          onChangeDate={handleChangeEndDate}
        />
      </div>
      {error ? (
        <p className="text-error text-xs mt-4 text-center font-bold">
          Un problème est survenu lors du changement des dates
          {/*La date de début doit être comprise entre aujourd'hui et la date de
          fin de la formation.*/}
        </p>
      ) : null}
    </div>
  );
};

export default DatesSelecter;
