import moment from "moment/min/moment-with-locales";
import "moment/locale/fr";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarCustomToolbar from "./calendar-custom-toolbar";
import { adjustScheduleToCurrentWeek } from "../../../utils/calendar-utils";

moment.locale("fr");
const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

const colors = [
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
];

const BigCalendarTimeline = ({ data }: { data: Event[] }) => {
  const dataAdjusted = adjustScheduleToCurrentWeek(data).map((event) => ({
    ...event,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  return (
    <Calendar
      culture="fr"
      localizer={localizer}
      events={dataAdjusted}
      startAccessor={(event: Event) => event.start}
      endAccessor={(event: Event) => event.end}
      views={["work_week"]}
      defaultView={Views.WORK_WEEK}
      className="h-[98%] bg-base-100 rounded-2xl shadow-2xl p-6 border-2 border-base-300 text-base-content"
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 18, 0, 0)}
      components={{
        toolbar: CalendarCustomToolbar,
      }}
      formats={{
        dayHeaderFormat: (date: Date) => moment(date).format("dddd DD"),
        timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
        dayFormat: (date: Date) =>
          moment(date)
            .format("dddd DD")
            .replace(/^\w/, (c) => c.toUpperCase()),
        dayRangeHeaderFormat: (range) =>
          `Semaine du ${moment(range.start).format("DD MMMM")} au ${moment(range.end).format("DD MMMM")}`,
      }}
      slotPropGetter={() => ({
        className: "border-base-300 text-sm font-inter p-3",
      })}
      eventPropGetter={(event: Event) => ({
        className: `bg-gradient-to-br from-${event.color} via-${event.color}-focus to-${event.color} rounded-xl text-secondary-content font-bold p-2 px-3 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-xl hover:scale-[1.02] border border-secondary-focus/20`,
      })}
      step={60}
      timeslots={1}
    />
  );
};

export default BigCalendarTimeline;
