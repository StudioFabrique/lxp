import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarCustomToolbar from "./calendar-custom-toolbar";
import "moment/locale/fr";
import { adjustScheduleToCurrentWeek } from "../../../utils/calendar-utils";

// Set locale before creating localizer
moment.locale("fr");
const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const BigCalendarTimeline = ({ data }: { data: Event[] }) => {
  const dataAdjusted = adjustScheduleToCurrentWeek(data);

  return (
    <Calendar
      localizer={localizer}
      events={dataAdjusted}
      startAccessor={(event: Event) => event.start}
      endAccessor={(event: Event) => event.end}
      views={["week"]}
      view={Views.WEEK}
      className="h-[98%] bg-base-100 rounded-xl shadow-lg p-5"
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
      components={{
        toolbar: CalendarCustomToolbar,
      }}
      formats={{
        dayHeaderFormat: (date: Date) => moment(date).format("dddd DD"),
        timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
        dayFormat: (date: Date) => moment(date).format("dddd DD"),
      }}
      slotPropGetter={() => ({
        className:
          "bg-base-200 border-t border-base-300 text-sm font-inter p-2 transition-all hover:bg-base-300",
      })}
      eventPropGetter={() => ({
        className:
          "bg-gradient-to-r from-primary to-secondary rounded-lg text-primary-content font-semibold p-1 px-2 shadow-primary-content/20 shadow-lg cursor-pointer transition-transform hover:-translate-y-[1px] hover:shadow-primary-content/30",
      })}
      step={60}
      timeslots={1}
    />
  );
};

export default BigCalendarTimeline;
