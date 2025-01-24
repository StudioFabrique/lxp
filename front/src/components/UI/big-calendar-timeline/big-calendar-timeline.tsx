import moment from "moment/min/moment-with-locales";
import "moment/locale/fr";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarCustomToolbar from "./calendar-custom-toolbar";
import { adjustScheduleToCurrentWeek } from "../../../utils/calendar-utils";
import { Dispatch, SetStateAction } from "react";

moment.locale("fr");
const localizer = momentLocalizer(moment);

export interface Event {
  id: number;
  alternateId?: number;
  firstLessonId: number;
  title: string;
  start: Date;
  end: Date;
  link?: string;
}

// interface ColorEvent {
//   alternateId: number;
//   color: string;
// }

type BigCalendarTimelineProps = {
  data: Event[];
  view: View;
  // colors?: ColorEvent[];
  onSetView: Dispatch<SetStateAction<View>>;
  onRangeChange: (
    range: { start: Date; end: Date } | Date[],
    view?: View,
  ) => void;
  onDoubleClickEvent?: (event: Event) => void;
};

const BigCalendarTimeline = ({
  data,
  view,
  // colors,
  onSetView,
  onRangeChange,
  onDoubleClickEvent,
}: BigCalendarTimelineProps) => {
  const dataAdjusted = adjustScheduleToCurrentWeek(data);

  return (
    <Calendar
      culture="fr"
      localizer={localizer}
      events={dataAdjusted}
      startAccessor={(event: Event) => event.start}
      endAccessor={(event: Event) => event.end}
      views={["month", "work_week", "day"]}
      view={view}
      onView={onSetView}
      className="rbc-calendar bg-base-100 rounded-2xl shadow-xl p-6 border-2 border-base-content/20 text-base-content hover:border-base-content/30 transition-colors"
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 18, 0, 0)}
      components={{
        toolbar: CalendarCustomToolbar,
      }}
      style={{ height: view === "month" ? 600 : "" }}
      formats={{
        dayHeaderFormat: (date: Date) => moment(date).format("dddd DD MMMM"),
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
      eventPropGetter={
        (/*event: Event*/) => ({
          // style: {
          //   background: colors?.find(
          //     (color) => color.alternateId === event.alternateId,
          //   )?.color,
          //   color: getDaisyuiBgThemeColor("base-100"),
          // },
          className:
            "rounded-xl font-bold p-2 px-3 shadow-sm cursor-pointer transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md hover:scale-[1.02] border border-gray-200",
        })
      }
      step={60}
      timeslots={1}
      onRangeChange={onRangeChange}
      onDoubleClickEvent={onDoubleClickEvent}
    />
  );
};

export default BigCalendarTimeline;
