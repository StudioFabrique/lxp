import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";

const Calendar = ({ interfaceType }: { interfaceType: string }) => (
  <li>
    <Link to={`/${interfaceType}`}>
      <div className="tooltip tooltip-top w-6 h-6 z-10" data-tip="Calendrier">
        <CalendarIcon />
      </div>
    </Link>
  </li>
);

export default Calendar;
