import {
  useState,
  useEffect,
  useMemo,
  PropsWithChildren,
  ReactNode,
} from "react";
import { getMinutes } from "./calendar-utils";
import {
  CalendarEvent,
  CalendarView,
  daysOfWeek,
  HOUR_HEIGHT,
  theme,
} from "./calendar-configuration";
import MonthView from "./views/month-view";
import TimelineView from "./views/timeline-view";

interface Props {
  events: CalendarEvent[];
  currentDate: Date;
  startHour?: number;
  endHour?: number;
  view?: CalendarView;
  darkMode?: boolean;
  header?: ReactNode;
}

const Calendar = ({
  events,
  currentDate,
  startHour = 8,
  endHour = 19,
  view = "week",
  darkMode = false,
  header,
}: PropsWithChildren<Props>) => {
  const [nowTime, setNowTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // --- RENDER HELPERS ---

  const getEventStyle = (start: string, end: string) => {
    const startMin = getMinutes(start);
    const endMin = getMinutes(end);
    const startOffset = startHour * 60;
    const top = ((startMin - startOffset) / 60) * HOUR_HEIGHT;
    const height = ((endMin - startMin) / 60) * HOUR_HEIGHT;
    return { top: `${top}px`, height: `${height}px` };
  };

  const getCurrentTimeIndicator = () => {
    const currentMinutes = nowTime.getHours() * 60 + nowTime.getMinutes();
    const startOffset = startHour * 60;
    const top = ((currentMinutes - startOffset) / 60) * HOUR_HEIGHT;
    let dayIndex = nowTime.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;

    if (nowTime.getHours() < startHour || nowTime.getHours() >= endHour)
      return null;
    return { top: `${top}px`, dayIndex };
  };

  const timeIndicator = getCurrentTimeIndicator();

  const getRealDayIndex = (viewIndex: number) => {
    if (view === "week") return viewIndex;
    let dayIndex = currentDate.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;
    return dayIndex;
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
      {view === "month" ? (
        <MonthView darkMode={darkMode} />
      ) : (
        <TimelineView
          view={view}
          startHour={startHour}
          endHour={endHour}
          currentDate={currentDate}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Calendar;
