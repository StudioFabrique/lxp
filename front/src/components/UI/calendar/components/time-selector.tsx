import { CalendarClock } from "lucide-react";
import { MouseEvent } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = { date: Date | undefined; setDate: (date: Date) => void };

const TimeSelector = ({ date, setDate }: Props) => {
  const today = new Date();

  const handleClickToday = (e: MouseEvent) => {
    e.stopPropagation();
    setDate(today);
  };

  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="cursor-pointer input input-border input-sm w-[10rem] rounded-xl flex justify-between items-center"
      >
        {date ? date.toLocaleDateString() : "Pick a date"}

        {date?.getDate() !== today.getDate() && (
          <button
            type="button"
            className="btn btn-xs btn-ghost p-0 px-0.5 tooltip tooltip-right"
            data-tip="Aller à aujourd'hui"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClickToday}
          >
            <CalendarClock className="w-4 h-4" />
          </button>
        )}
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-50 shadow-md mt-2 bg-base-100 p-2 rounded-box"
      >
        <DayPicker
          required
          className="react-day-picker"
          mode="single"
          selected={date}
          onSelect={setDate}
          animate
        />
      </div>
    </div>
  );
};

export default TimeSelector;
