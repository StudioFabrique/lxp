import moment from "moment";
import { Calendar as Cal } from "react-big-calendar";
import { momentLocalizer } from "react-big-calendar";

const Calendar = () => {
  const localizer = momentLocalizer(moment);
  return (
    <div className="h-[50vh] flex justify-center">
      <Cal localizer={localizer} />
    </div>
  );
};

export default Calendar;
