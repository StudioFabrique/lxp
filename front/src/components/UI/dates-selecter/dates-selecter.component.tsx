import React, { FC, useEffect, useMemo } from "react";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

const DatesSelecter: FC<{
  onSubmitDates: (dates: { startDate: string; endDate: string }) => void;
}> = ({ onSubmitDates }) => {
  console.log("dates is rendering");
  const { value: startDate } = useInput((value) => regexGeneric.test(value));
  const { value: endDate } = useInput((value) => regexGeneric.test(value));

  console.log(startDate.value, endDate.value);

  const dates = useMemo(() => {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
    };
  }, [startDate.value, endDate.value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (startDate.isValid && endDate.isValid) {
        onSubmitDates(dates);
      }
    }, autoSubmitTimer);
    return () => {
      clearTimeout(timer);
    };
  }, [dates, startDate.isValid, endDate.isValid, onSubmitDates]);

  return (
    <div className="w-full flex flex-col gap-y-4 p-4 rounded-lg bg-secondary/10">
      <h3 className="font-bold text-xl">Date</h3>
      <form className="flex flex-col gap-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
          <p>Début</p>
          <input
            className="input input-sm max-w-sm"
            name="startingDate"
            type="date"
            defaultValue={startDate.value}
            onChange={startDate.valueChangeHandler}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-2">
          <p>Fin</p>
          <input
            className="input input-sm max-w-sm"
            name="endingDate"
            type="date"
            defaultValue={endDate.value}
            onChange={endDate.valueChangeHandler}
          />
        </div>
      </form>
    </div>
  );
};

export default DatesSelecter;
