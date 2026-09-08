import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { MouseEvent } from "react";
import DatePicker from "../../../components/UI/date-picker/date-picker";
import { parseDateValue } from "../../../components/UI/date-picker/date-picker.utils";
import { formatDateToYYYYMMDD } from "../../../utils/helpers/convert-date";
import { CalendarView } from "./calendar-configuration";

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
      <div className="w-44">
        <DatePicker
          value={date ? formatDateToYYYYMMDD(date) : ""}
          onChange={(value) => {
            const selectedDate = parseDateValue(value);
            if (selectedDate) setDate(selectedDate);
          }}
          ariaLabel="Date affichée"
          placeholder="Choisir une date"
          display="short"
          clearable={false}
        />
      </div>
      {!isToday && (
        <button
          type="button"
          className="btn btn-sm btn-ghost btn-square text-primary tooltip tooltip-right transition-transform hover:scale-105"
          data-tip="Revenir à aujourd'hui"
          aria-label="Revenir à la date d'aujourd'hui"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleClickToday}
        >
          <CalendarClock className="w-4 h-4" />
        </button>
      )}
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
