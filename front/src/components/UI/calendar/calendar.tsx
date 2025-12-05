import { PropsWithChildren, ReactNode } from "react";
import {
  CalendarEvent,
  CalendarView,
  theme,
  TimelineEvent, // Import new Type
} from "./calendar-configuration";
import MonthView from "./views/month-view";
import TimelineView from "./views/timeline-view";
import YearTimelineView from "./views/year-timeline-view"; // Import new Component

interface Props {
  events: CalendarEvent[];
  // New Prop: Optional because not all views need it
  timelineEvents?: TimelineEvent[];

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
  timelineEvents = [], // Default to empty array
  currentDate,
  startHour = 8,
  endHour = 19,
  view = "week",
  currentWeekDayVisible = true,
  darkMode = false,
  header,
}: PropsWithChildren<Props>) => {
  // Helper to render the correct view body
  const renderBody = () => {
    switch (view) {
      case "month":
        return (
          <MonthView
            events={events}
            currentDate={currentDate}
            darkMode={darkMode}
          />
        );
      case "year-timeline":
        return <YearTimelineView events={timelineEvents} darkMode={darkMode} />;
      case "week":
      case "day":
      default:
        return (
          <TimelineView
            events={events}
            view={view}
            startHour={startHour}
            endHour={endHour}
            currentDate={currentDate}
            currentWeekDayVisible={currentWeekDayVisible}
            darkMode={darkMode}
          />
        );
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-xl shadow-xl overflow-hidden border font-sans transition-colors duration-300 ${
        theme(darkMode).bg
      } ${theme(darkMode).text} ${theme(darkMode).border}`}
    >
      {/* --- HEADER --- */}
      {header}

      {/* --- BODY --- */}
      {renderBody()}
    </div>
  );
};

export default Calendar;
