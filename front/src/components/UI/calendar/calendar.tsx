import { PropsWithChildren, ReactNode } from "react";
import { CalendarEvent, CalendarView, theme } from "./calendar-configuration";
import MonthView from "./views/month-view";
import TimelineView from "./views/timeline-view";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  startHour?: number;
  endHour?: number;
  view?: CalendarView;
  currentWeekDayVisible?: boolean;
  darkMode?: boolean;
  header?: ReactNode;
}

const Calendar = ({
  events,
  currentDate,
  startHour = 8,
  endHour = 19,
  view = "week",
  currentWeekDayVisible = true,
  darkMode = false,
  header,
}: PropsWithChildren<Props>) => {
  return (
    <div
      className={`flex flex-col h-full rounded-xl shadow-xl overflow-hidden border font-sans transition-colors duration-300 ${
        theme(darkMode).bg
      } ${theme(darkMode).text} ${theme(darkMode).border}`}
    >
      {/* --- HEADER --- */}
      {header}

      {/* --- BODY --- */}
      {view === "month" ? (
        <MonthView
          events={events}
          currentDate={currentDate}
          darkMode={darkMode}
        />
      ) : (
        <TimelineView
          events={events}
          view={view}
          startHour={startHour}
          endHour={endHour}
          currentDate={currentDate}
          currentWeekDayVisible={currentWeekDayVisible}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Calendar;
