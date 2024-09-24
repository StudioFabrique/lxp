import moment from "moment";
import { Calendar } from "react-big-calendar";
import { momentLocalizer } from "react-big-calendar";

const localizer = momentLocalizer(moment);

const Calendrier = () => {
  return (
    <div className="h-[50vh] flex justify-center">
      <Calendar
        className="col-span-2 bg-white rounded-lg p-5"
        localizer={localizer}
      />
    </div>
  );
};

export default Calendrier;
