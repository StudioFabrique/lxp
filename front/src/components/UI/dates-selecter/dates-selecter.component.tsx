import React, { FC, useEffect, useMemo, useState } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";
import Wrapper from "../wrapper/wrapper.component";

const DatesSelecter: FC<{
  onSubmitDates: (dates: { startDate: string; endDate: string }) => void;
}> = ({ onSubmitDates }) => {
  const { value: startDate } = useInput((value) => regexGeneric.test(value));
  const { value: endDate } = useInput((value) => regexGeneric.test(value));
  const [error, setError] = useState(false);

  const dates = useMemo(() => {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
    };
  }, [startDate.value, endDate.value]);

  useEffect(() => {
    setError(false);
    const timer = setTimeout(() => {
      const date = new Date().getTime();
      const sDate = new Date(dates.startDate).getTime();
      const eDate = new Date(dates.endDate).getTime();
      if (startDate.isValid && endDate.isValid) {
        if (sDate > date && sDate < eDate) {
          onSubmitDates(dates);
        } else {
          setError(true);
        }
      }
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [dates, startDate.isValid, endDate.isValid, onSubmitDates]);

  return (
    <Wrapper>
      <h3 className="font-bold text-xl">Date</h3>
      <div className="flex flex-col gap-y-4">
        <div className="flex justify-between items-center">
          <p>Début</p>
          <input
            className="input input-sm w-5/6"
            name="startingDate"
            type="date"
            defaultValue={startDate.value}
            onChange={startDate.valueChangeHandler}
          />
        </div>
        <div className="flex justify-between items-center">
          <p>Fin</p>
          <input
            className="input input-sm w-5/6"
            name="endingDate"
            type="date"
            defaultValue={endDate.value}
            onChange={endDate.valueChangeHandler}
          />
        </div>
      </div>
        {error ? (
          <p className="text-base-content text-xs mt-4 text-center font-bold">
            La date de début doit être comprise entre aujourd'hui et la date de
            fin de la formation
          </p>
        ) : null}
    </Wrapper>
  );
};

export default DatesSelecter;
