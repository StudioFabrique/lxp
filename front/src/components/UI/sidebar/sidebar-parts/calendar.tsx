import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";

const Calendar = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "calendar";

  return (
    <li>
      <Link to={`/${currentRoute[0]}`}>
        <div
          className={`tooltip tooltip-right w-6 h-6 ${
            isCurrentPathActive && "text-primary"
          }`}
          data-tip="Calendrier"
        >
          <CalendarIcon />
        </div>
      </Link>
    </li>
  );
};

export default Calendar;
