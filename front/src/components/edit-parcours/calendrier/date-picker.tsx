import { ChangeEvent, ChangeEventHandler, FC, Ref, useRef } from "react";
import CalendarIcon from "../../UI/svg/calendar-icon";

const DatePicker: FC<{
  id: string;
  date: string;
  onSubmitDate: (id: string, date: string) => void;
}> = ({ id, date, onSubmitDate }) => {
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
    <span className="flex gap-x-2">
      <input className="input btn-sm" type="text" value={date} />
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
        className="invisible"
      />
    </span>
  );
};

export default DatePicker;
