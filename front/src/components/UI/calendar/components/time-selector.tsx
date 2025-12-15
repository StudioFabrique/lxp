import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = { date: Date | undefined; setDate: (date: Date) => void };

const TimeSelector = ({ date, setDate }: Props) => {
  return (
    <div className="dropdown">
      <div
        tabIndex={0}
        role="button"
        className="cursor-pointer input input-border input-sm w-[10rem] rounded-xl"
      >
        {date ? date.toLocaleDateString() : "Pick a date"}
      </div>
      <div tabIndex={0} className="dropdown-content z-50 shadow-md mt-2">
        <DayPicker
          required
          className="react-day-picker"
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </div>
    </div>
  );
};

export default TimeSelector;
