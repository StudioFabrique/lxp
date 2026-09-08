import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { formatDateToYYYYMMDD } from "../../../../src/utils/helpers/convert-date";
import DatePicker from "../date-picker/date-picker";
import useInput from "../../../hooks/useInput";
import { regexGeneric } from "../../../config/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

type Props = {
  onSubmitDates: (dates: { startDate: string; endDate: string }) => void;
  label?: string;
  startDateProp?: string;
  endDateProp?: string;
  disabled?: boolean;
};

const DatesSelecter: FC<Props> = ({
  startDateProp = "",
  endDateProp = "",
  label = "",
  onSubmitDates,
  disabled = false,
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

  useEffect(() => {
    if (disabled) return;
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
    disabled,
  ]);

  const handleChangeStartDate = useCallback(
    (value: string) => {
      if (disabled) return;
      startDate.datePicking(value);
      setSubmit(true);
    },
    [disabled, startDate],
  );

  const handleChangeEndDate = useCallback(
    (value: string) => {
      if (disabled) return;
      endDate.datePicking(value);
      setSubmit(true);
    },
    [disabled, endDate],
  );
  return (
    <div className="flex flex-col gap-y-4">
      <h3 className="font-bold">{label}</h3>
      <div className="flex flex-col gap-y-4">
        <DatePicker
          id="date1"
          name="startingDate"
          label="Début"
          value={dates.startDate}
          max={dates.endDate}
          onChange={handleChangeStartDate}
          disabled={disabled}
        />
        <DatePicker
          id="date2"
          name="endingDate"
          label="Fin"
          value={dates.endDate}
          min={dates.startDate}
          onChange={handleChangeEndDate}
          disabled={disabled}
        />
      </div>
      {error ? (
        <p className="text-error text-xs mt-4 text-center font-bold">
          La date de début doit être inférieure à la date de fin
        </p>
      ) : null}
    </div>
  );
};

export default DatesSelecter;
