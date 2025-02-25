import moment from "moment/min/moment-with-locales";
import "moment/locale/fr";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CalendarCustomToolbar from "./calendar-custom-toolbar";
import {
  adjustScheduleToCurrentWeek,
  getColorByAlternateId,
} from "../../../utils/calendar-utils";
import { Dispatch, PropsWithChildren, SetStateAction } from "react";
import FadeWrapper from "../fade-wrapper/fade-wrapper";

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
      className="rbc-calendar bg-base-100 rounded-2xl shadow-xl p-6 border-2 border-base-content/30 hover:border-base-content/50 transition-colors"
      min={new Date(2025, 1, 0, 8, 0, 0)}
      max={new Date(2025, 1, 0, 18, 0, 0)}
      components={{
        toolbar: CalendarCustomToolbar,
        eventContainerWrapper: ({ children }: PropsWithChildren) => (
          <FadeWrapper>{children}</FadeWrapper>
        ),
        event: ({ event }) => (
          <div className="card w-full h-full bg-black">
            <div className="card-body p-2 flex-row items-center gap-3">
              <h3 className="card-title text-primary text-sm text-wrap truncate">
                {event.title}
              </h3>
            </div>
          </div>
        ),
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
        eventTimeRangeFormat: () => "",
      }}
      slotPropGetter={() => ({
        className: "border-base-300 text-sm font-inter p-3",
      })}
      eventPropGetter={(event) => {
        console.log({ color: getColorByAlternateId(event.alternateId ?? 1) });

        return {
          style: {
            background: "transparent",
            border: "0px",
          },
          className:
            "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        };
      }}
      step={60}
      timeslots={1}
      onRangeChange={onRangeChange}
      onDoubleClickEvent={onDoubleClickEvent}
    />
  );
};

export default BigCalendarTimeline;
