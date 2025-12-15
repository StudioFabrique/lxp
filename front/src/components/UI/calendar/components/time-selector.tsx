import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { MouseEvent } from "react";
import { DayPicker } from "react-day-picker";
import { fr } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { CalendarView } from "../calendar-configuration";
import { formatDate } from "../calendar-utils";

type Props = {
  view?: CalendarView;
  date: Date | undefined;
  setDate: (date: Date) => void;
};

const TimeSelector = ({ view = "week", date, setDate }: Props) => {
  const today = new Date();
  const isToday = date?.toDateString() === today.toDateString();

  const handleClickToday = (e: MouseEvent) => {
    e.stopPropagation();
    setDate(today);
  };

  const handleClickPreviousDate = () => {
    const baseDate = date || new Date();
    const newDate = new Date(baseDate);

    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "year-timeline":
        break;
      default:
        break;
    }

    setDate(newDate);
  };

  const handleClickNextDate = () => {
    const baseDate = date || new Date();
    const newDate = new Date(baseDate);

    switch (view) {
      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(newDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "year-timeline":
        break;
      default:
        break;
    }

    setDate(newDate);
  };

  return (
    <div className="flex gap-1 items-center mr-2">
      <button
        type="button"
        className="btn btn-sm rounded-xl"
        onClick={handleClickPreviousDate}
      >
        <ChevronLeft className="w-5" />
      </button>
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="cursor-pointer input input-border input-sm w-[10rem] rounded-xl flex justify-between items-center"
        >
          {date ? formatDate(date.toLocaleDateString()) : "Pick a date"}

          {!isToday && (
            <button
              type="button"
              className="btn btn-xs btn-ghost btn-square text-primary tooltip tooltip-right transition-transform hover:scale-105"
              data-tip="Revenir à aujourd'hui"
              aria-label="Revenir à la date d'aujourd'hui" // Accessibility
              onMouseDown={(e) => e.preventDefault()} // Prevents focus stealing
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
            locale={fr}
          />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-sm rounded-xl"
        onClick={handleClickNextDate}
      >
        <ChevronRight className="w-5" />
      </button>
    </div>
  );
};

export default TimeSelector;
