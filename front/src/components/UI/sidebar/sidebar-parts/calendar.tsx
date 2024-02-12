import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";

const Calendar = ({ currentRoute }: { currentRoute: string[] }) => {
  const isCurrentPathActive = currentRoute[1] === "calendar";

  return (
    <li>
      <Link to={`/${currentRoute[0]}/calendar`}>
        <div
          className={`tooltip tooltip-right w-6 h-6 ${
            isCurrentPathActive && "text-primary"
          }`}
          data-tip="Calendrier"
        >
          <div className="flex hover:text-primary text-primary-content justify-center items-center">
            <CalendarIcon className="z-10 pointer-events-none" />
            <span
              className={`absolute p-5 rounded-lg ${
                isCurrentPathActive && "bg-primary/50"
              }`}
            />
          </div>
        </div>
      </Link>
    </li>
  );
};

export default Calendar;
