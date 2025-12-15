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
  isSameDate, // Make sure this is imported from your utils
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
}: Props) => {
  const [nowTime, setNowTime] = useState(new Date());

  const hours = useMemo(() => {
    return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  }, [startHour, endHour]);

  // Determine Visible Days for Day/Week views
  const visibleDays = useMemo(() => {
    if (view === "week") return daysOfWeek;
    // For Day view, we use currentDate, not nowTime
    let dayIndex = currentDate.getDay() - 1;
    if (dayIndex === -1) dayIndex = 6;
    return [daysOfWeek[dayIndex]];
  }, [view, currentDate]);

  const timeIndicator = getCurrentTimeIndicator(
    nowTime,
    startHour,
    endHour,
    style
  );

  useEffect(() => {
    const timer = setInterval(() => setNowTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="select-none flex flex-1 overflow-y-auto relative">
      {/* TIME COLUMN */}
      <div
        className={`sticky left-0 z-30 w-16 flex-shrink-0 border-r ${
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
            className={`flex h-10 sticky top-0 z-20 border-b ${
              theme(darkMode).headerBg
            } ${theme(darkMode).border}`}
          >
            {visibleDays.map((day, i) => {
              const realIndex = getRealDayIndex(i, view, currentDate);

              // Simplified: Highlight if dayIndex matches Today's index
              const isTodaySimple = timeIndicator?.dayIndex === realIndex;

              return (
                <div
                  key={day}
                  className={`flex-1 flex items-center justify-center font-bold text-sm min-w-[100px] 
                  ${
                    isTodaySimple
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

              // --- LOGIC TO DETERMINE DATE OF THIS COLUMN ---
              // We need the exact date object to compare with event.date
              const columnDate = new Date(currentDate);

              if (view === "week") {
                // Calculate Monday of the current week
                const currentDay = columnDate.getDay(); // 0 (Sun) to 6 (Sat)
                const distanceToMonday = (currentDay + 6) % 7; // Convert to Mon=0, Sun=6
                columnDate.setDate(columnDate.getDate() - distanceToMonday + i);
              }
              // If view is 'day', columnDate is already currentDate
              // ----------------------------------------------

              return (
                <div
                  key={i}
                  className={`flex-1 border-r last:border-0 relative min-w-[100px] group ${
                    theme(darkMode).border
                  }`}
                >
                  {events
                    .filter((e) => {
                      // 1. Check Hour bounds
                      const startH = parseInt(e.start.split(":")[0]);
                      if (startH < startHour || startH >= endHour) return false;

                      // 2. Check Date Logic
                      if (e.date) {
                        // One-off event: must match the exact date of this column
                        return isSameDate(e.date, columnDate);
                      } else {
                        // Recurring event: matches the day index (Mon/Tue/etc)
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
                            style
                          )}
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
                  {timeIndicator && timeIndicator.dayIndex === colDayIndex && (
                    <div
                      className="absolute w-full flex items-center z-30 pointer-events-none"
                      style={{ top: timeIndicator.top }}
                    >
                      <div className="w-2 h-2 rounded-full bg-red-500 -ml-1 shadow-sm ring-2 ring-transparent"></div>
                      <div className="h-[2px] w-full bg-red-500 opacity-60"></div>
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
