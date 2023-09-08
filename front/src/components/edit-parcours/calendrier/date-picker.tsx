import { ChangeEvent, ChangeEventHandler, FC, Ref, useRef } from "react";
import CalendarIcon from "../../UI/svg/calendar-icon";

const DatePicker: FC<{
  id: string;
  date: string;
  label?: string;
  onSubmitDate: (id: string, date: string) => void;
}> = ({ id, date, label, onSubmitDate }) => {
  const dateRef: Ref<HTMLInputElement> = useRef(null);

  const handleClick = () => {
    dateRef.current?.showPicker();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    onSubmitDate(event.target.id, event.target.value);
  };

  return (
    <span className="flex gap-x-2 items-center justify-between">
      {label && <label className="w-20">{label}</label>}
      <input
        className="input btn-sm sm:w-20 md:w-24 lg:w-40 text-center"
        type="text"
        value={date}
        onChange={handleChange}
      />
      <button
        onClick={handleClick}
        className="btn btn-sm rounded-md"
        type="button"
      >
        <CalendarIcon />
      </button>
      <input
        id={id}
        onChange={handleChange}
        value={date}
        ref={dateRef}
        type="date"
        className="invisible -translate-x-2"
      />
    </span>
  );
};

export default DatePicker;
