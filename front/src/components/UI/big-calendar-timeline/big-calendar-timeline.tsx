import { Calendar, momentLocalizer, Views, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import CalendarCustomToolbar from "./calendar-custom-toolbar";
import "moment/locale/fr";

const localizer = momentLocalizer(moment);
moment.locale("fr");

interface Event {
  title: string;
  start: Date;
  end: Date;
}

const BigCalendarTimeline = ({ data }: { data: Event[] }) => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <Calendar
      localizer={localizer}
      events={data}
      startAccessor={(event: Event) => event.start}
      endAccessor={(event: Event) => event.end}
      views={["work_week", "day"]}
      view={view}
      className="h-[98%] bg-base-100 rounded-xl shadow-lg p-5"
      onView={handleOnChangeView}
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 17, 0, 0)}
      components={{
        toolbar: CalendarCustomToolbar,
      }}
      formats={{
        dayHeaderFormat: (date: Date) =>
          moment(date).format("dddd DD").toLowerCase(),
        timeGutterFormat: (date: Date) => moment(date).format("HH:mm"),
        dayFormat: (date: Date) => moment(date).format("dddd DD").toLowerCase(),
      }}
      slotPropGetter={() => ({
        className:
          "bg-base-200 border-t border-base-300 text-sm font-inter p-2 transition-all hover:bg-base-300",
      })}
      eventPropGetter={() => ({
        className:
          "bg-gradient-to-r from-primary to-secondary rounded-lg text-primary-content font-semibold p-1 px-2 shadow-primary-content/20 shadow-lg cursor-pointer transition-transform hover:-translate-y-[1px] hover:shadow-primary-content/30",
      })}
    />
  );
};

export default BigCalendarTimeline;
