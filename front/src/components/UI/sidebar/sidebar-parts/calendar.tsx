import { Link } from "react-router-dom";
import { CalendarIcon } from "lucide-react";

const Calendar = ({ interfaceType }: { interfaceType: string }) => (
  <li>
    <Link to={`/${interfaceType}`}>
      <div className="tooltip tooltip-right w-6 h-6" data-tip="Accueil LXP">
        <CalendarIcon />
      </div>
    </Link>
  </li>
);

export default Calendar;
