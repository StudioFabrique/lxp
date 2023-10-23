import React, { useEffect, useRef, useState } from "react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import DatesSelecter from "../../UI/dates-selecter/dates-selecter.component";
import CourseDates from "../../../utils/interfaces/course-dates";
import useInput from "../../../hooks/use-input";
import { regexGeneric } from "../../../utils/constantes";
import { autoSubmitTimer } from "../../../config/auto-submit-timer";

interface DateItemProps {
  dateItem?: CourseDates;
  onSubmitDates: (dates: any) => void;
}

const DatesItem = (props: DateItemProps) => {
  const { dateItem } = props;
  const { value: synchrone } = useInput(
    (value) => regexGeneric.test(value),
    dateItem?.synchroneDuration.toString() ?? "0"
  );
  const { value: asynchrone } = useInput(
    (value) => regexGeneric.test(value),
    dateItem?.asynchroneDuration.toString() ?? "0"
  );
  const [dates, setDates] = useState<any | null>(null);
  const isInitialRender = useRef(true);

  /**
   * définit le style du champ formulaire en fonction de sa validité
   * @param hasError boolean
   * @returns string
   */
  const setInputStyle = (hasError: boolean) => {
    return hasError
      ? "flex-1 input input-error text-error input-sm input-bordered focus:outline-none w-full"
      : "flex-1 input input-sm input-bordered focus:outline-none w-full";
  };

  const handlesSubmitDates = (dates: any) => {
    setDates(dates);
  };

  useEffect(() => {
    let timer: any;
    if (!isInitialRender.current) {
      if (synchrone.isValid && asynchrone.isValid) {
        timer = setTimeout(() => {
          props.onSubmitDates({
            startDate: dates.startDate,
            endDate: dates.endDate,
            synchroneDuration: synchrone.value,
            asynchroneDuration: asynchrone.value,
          });
        }, autoSubmitTimer);
      }
    } else {
      isInitialRender.current = false;
    }
    return () => clearTimeout(timer);
  }, [
    dates,
    synchrone.value,
    asynchrone.value,
    synchrone.isValid,
    asynchrone.isValid,
    props,
  ]);

  return (
    <>
      <Wrapper>
        <h2 className="text-sm font-bold">Dates de cours *</h2>
        <div className="flex flex-col gap-y-8">
          <DatesSelecter
            startDateProp={dateItem?.minDate ?? ""}
            endDateProp={dateItem?.maxDate ?? ""}
            onSubmitDates={handlesSubmitDates}
          />
        </div>
      </Wrapper>
      <Wrapper>
        <h2 className="text-sm font-bold">Durée du cours</h2>
        <form className="flex flex-col gap-y-8">
          <div className="flex justify-between items-center gap-x-4">
            <label className="w-2/6" htmlFor="synchrone">
              Synchrone
            </label>
            <input
              className={setInputStyle(synchrone.hasError)}
              type="number"
              id="synchrone"
              name="synchrone"
              min={0}
              value={synchrone.value}
              onChange={synchrone.valueChangeHandler}
              onBlur={synchrone.valueBlurHandler}
            />
          </div>
          <div className="flex justify-between items-center gap-x-4">
            <label className="w-2/6" htmlFor="asynchrone">
              Asynchrone
            </label>
            <input
              className={setInputStyle(asynchrone.hasError)}
              type="number"
              id="asynchrone"
              name="asynchrone"
              min={0}
              value={asynchrone.value}
              onChange={asynchrone.valueChangeHandler}
              onBlur={asynchrone.valueBlurHandler}
            />
          </div>
        </form>
      </Wrapper>
    </>
  );
};

export default DatesItem;
