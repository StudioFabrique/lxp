import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = { date: Date | undefined; setDate: (date: Date) => void };

const TimeSelector = ({ date, setDate }: Props) => {
  return (
    <>
      <div>
        <button
          popoverTarget="rdp-popover"
          className="cursor-pointer input input-border input-sm w-[10rem] rounded-xl"
          style={{ anchorName: "--rdp" } as React.CSSProperties}
        >
          {date ? date.toLocaleDateString() : "Pick a date"}
        </button>
        <div
          popover="auto"
          id="rdp-popover"
          className="dropdown"
          style={{ positionAnchor: "--rdp" } as React.CSSProperties}
        >
          <DayPicker
            required
            className="react-day-picker"
            mode="single"
            selected={date}
            onSelect={setDate}
          />
        </div>
      </div>
    </>
  );
};

export default TimeSelector;
