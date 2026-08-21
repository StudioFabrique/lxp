import { useEffect, useMemo, useState } from "react";
import {
  CalendarEvent,
  CalendarView,
  daysOfWeek,
  eventConfig,
  theme,
} from "../calendar-configuration";
import {
  getCurrentTimeIndicator,
  getEventStyle,
  getRealDayIndex,
  isSameDate,
} from "../calendar-utils";

type Props = {
  events: CalendarEvent[];
  view: CalendarView;
  currentDate: Date;
  startHour: number;
  endHour: number;
  darkMode: boolean;
  currentWeekDayVisible: boolean;
  style?: { hourHeight: number };
  onClickEventDetails?: (id: number | string, rect: DOMRect) => void;
};

const TimelineView = ({
  events,
  view,
  currentDate,
  startHour,
  endHour,
  darkMode,
  currentWeekDayVisible,
  style = { hourHeight: 60 },
  onClickEventDetails,
}: Props) => {
  const [nowTime, setNowTime] = useState(new Date());

  const hours = useMemo(() => {
    return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  }, [startHour, endHour]);

  // Determine Visible Days for Day/Week views
  const visibleDays = useMemo(() => {
    if (view === "week") return daysOfWeek;
    // For Day view, we use currentDate
    let dayIndex = currentDate.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;
    return [daysOfWeek[dayIndex]];
  }, [view, currentDate]);

  const timeIndicator = getCurrentTimeIndicator(
    nowTime,
    startHour,
    endHour,
    style,
  );

  useEffect(() => {
    // Update the "now" time every minute
    const timer = setInterval(() => setNowTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="select-none flex flex-1 overflow-y-auto relative">
      {/* TIME COLUMN */}
      <div
        className={`sticky left-0 z-10 w-16 flex-shrink-0 border-r ${
          theme(darkMode).sidebarBg
        } ${theme(darkMode).border}`}
      >
        {(view === "week" || currentWeekDayVisible) && <div className="h-10" />}
        <div
          className="relative"
          style={{ height: hours.length * style.hourHeight }}
        >
          {hours.map((h) => (
            <div
              key={h}
              className={`absolute w-full text-right pr-3 text-xs font-medium first:mt-1 -mt-2 ${
                theme(darkMode).subText
              }`}
              style={{ top: `${(h - startHour) * style.hourHeight}px` }}
            >
              {h}:00
            </div>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 min-w-[300px] overflow-x-auto">
        {(view === "week" || currentWeekDayVisible) && (
          <div
            className={`flex h-10 sticky top-0 z-10 border-b ${
              theme(darkMode).headerBg
            } ${theme(darkMode).border}`}
          >
            {visibleDays.map((day, i) => {
              // Calculate the specific date for this header to see if it is today
              const headerDate = new Date(currentDate);
              if (view === "week") {
                const currentDay = headerDate.getDay();
                const distanceToMonday = (currentDay + 6) % 7;
                headerDate.setDate(headerDate.getDate() - distanceToMonday + i);
              }

              // Check if this header represents "Today"
              const isTodayHeader = isSameDate(headerDate, nowTime);

              return (
                <div
                  key={day}
                  className={`flex-1 flex items-center justify-center font-bold text-sm min-w-[100px]
                  ${
                    isTodayHeader
                      ? theme(darkMode).todayText
                      : theme(darkMode).subText
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        )}

        <div
          className="relative"
          style={{ height: hours.length * style.hourHeight }}
        >
          {/* GRID LINES */}
          <div className="absolute inset-0 flex flex-col">
            {hours.map((h) => (
              <div
                key={h}
                className={`w-full border-b box-border ${
                  theme(darkMode).gridLine
                }`}
                style={{ height: style.hourHeight }}
              ></div>
            ))}
          </div>

          {/* COLUMNS */}
          <div className="absolute inset-0 flex">
            {visibleDays.map((_, i) => {
              const colDayIndex = getRealDayIndex(i, view, currentDate);

              // Determine the specific date for this column
              const columnDate = new Date(currentDate);

              if (view === "week") {
                // Calculate Monday of the current week
                const currentDay = columnDate.getDay(); // 0 (Sun) to 6 (Sat)
                const distanceToMonday = (currentDay + 6) % 7; // Convert to Mon=0, Sun=6
                columnDate.setDate(columnDate.getDate() - distanceToMonday + i);
              }

              // Check if this specific column date matches "Today"
              const isToday = isSameDate(columnDate, nowTime);

              return (
                <div
                  key={i}
                  className={`flex-1 border-r last:border-0 relative min-w-[100px] group ${
                    theme(darkMode).border
                  }`}
                >
                  {events
                    .filter((e) => {
                      const startH = parseInt(e.start.split(":")[0]);
                      if (startH < startHour || startH >= endHour) return false;

                      if (e.date) {
                        return isSameDate(e.date, columnDate);
                      } else {
                        return e.dayIndex === colDayIndex;
                      }
                    })
                    .map((event) => {
                      const styleClass = darkMode
                        ? eventConfig[event.type].dark
                        : eventConfig[event.type].light;

                      return (
                        <div
                          key={event.id}
                          className={`absolute inset-x-1 rounded-md px-2 py-1 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden z-10 group-hover:z-20 ${styleClass}`}
                          style={getEventStyle(
                            event.start,
                            event.end,
                            startHour,
                            style,
                          )}
                          onClick={(e) =>
                            onClickEventDetails?.(
                              event.id,
                              e.currentTarget.getBoundingClientRect(),
                            )
                          }
                        >
                          <div className="font-bold text-xs truncate leading-tight">
                            {event.title}
                          </div>
                          {event.subtitle && (
                            <div className="text-[10px] opacity-90 truncate">
                              {event.subtitle}
                            </div>
                          )}
                        </div>
                      );
                    })}

                  {/* NOW INDICATOR */}
                  {/* Only render if we have an indicator AND this column is actually today */}
                  {timeIndicator && isToday && (
                    <div
                      className="absolute w-full flex items-center z-10 pointer-events-none"
                      style={{ top: timeIndicator.top }}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-sm ring-2 ring-transparent" />
                      <div className="h-[2px] w-full bg-red-500 opacity-60" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
