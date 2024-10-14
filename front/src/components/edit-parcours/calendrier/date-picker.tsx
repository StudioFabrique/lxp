import {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  Ref,
  useMemo,
  useRef,
} from "react";
import CalendarIcon from "../../UI/svg/calendar-icon";

const DatePicker: FC<{
  id: string;
  name?: string;
  date: string;
  label?: string;
  disabled?: boolean;
  onSubmitDate?: (id: string, date: string) => void;
  onChangeDate?: (event: React.FormEvent<HTMLInputElement>) => void;
}> = ({ id, date, name, label, disabled, onSubmitDate, onChangeDate }) => {
  const dateFormatted = useMemo(
    () => new Date(date).toLocaleDateString("fr-FR"),
    [date],
  );

  const dateRef: Ref<HTMLInputElement> = useRef(null);

  const handleClick = () => {
    dateRef.current?.showPicker();
  };

  const handleChange: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (onSubmitDate) onSubmitDate(event.target.id, event.target.value);
    if (onChangeDate) onChangeDate(event);
  };

  return (
    <div className="flex">
      {label && <label className="w-20">{label}</label>}
      <span className="w-full flex gap-2 items-center justify-end">
        <input
          className="w-full input input-sm pl-5"
          type="text"
          name={name}
          value={dateFormatted}
          onChange={handleChange}
        />
        <button
          onClick={handleClick}
          className="btn btn-sm rounded-md fill-secondary"
          type="button"
          disabled={disabled}
        >
          <CalendarIcon />
        </button>
      </span>
      <input
        id={id}
        onChange={handleChange}
        value={date}
        ref={dateRef}
        type="date"
        className="w-0 invisible"
      />
    </div>
  );
};

export default DatePicker;
