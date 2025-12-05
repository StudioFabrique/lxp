import { useMemo } from "react";
import {
  CalendarView,
  daysOfWeek,
  HOUR_HEIGHT,
  theme,
} from "../calendar-configuration";

type Props = {
  view: CalendarView;
  currentDate: Date;
  startHour: number;
  endHour: number;
  darkMode: boolean;
};

const TimelineView = ({
  view,
  currentDate,
  startHour,
  endHour,
  darkMode,
}: Props) => {
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

  return (
    <div className="flex flex-1 overflow-y-auto relative">
      {/* TIME COLUMN */}
      <div
        className={`sticky left-0 z-30 w-16 flex-shrink-0 border-r ${
          theme(darkMode).sidebarBg
        } ${theme(darkMode).border}`}
      >
        <div
          className={`h-10 border-b ${theme(darkMode).border} ${
            theme(darkMode).headerBg
          }`}
        ></div>
        <div
          className="relative"
          style={{ height: hours.length * HOUR_HEIGHT }}
        >
          {hours.map((h) => (
            <div
              key={h}
              className={`absolute w-full text-right pr-3 text-xs font-medium -mt-2 ${
                theme(darkMode).subText
              }`}
              style={{ top: `${(h - startHour) * HOUR_HEIGHT}px` }}
            >
              {h}:00
            </div>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="flex-1 min-w-[300px] overflow-x-auto">
        <div
          className={`flex h-10 sticky top-0 z-20 border-b ${
            theme(darkMode).headerBg
          } ${theme(darkMode).border}`}
        >
          {visibleDays.map((day, i) => {
            const realIndex = getRealDayIndex(i);

            // In Week view, we just check day index match for generic "Today" highlighting if in current week
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

        <div
          className="relative"
          style={{ height: hours.length * HOUR_HEIGHT }}
        >
          {/* GRID LINES */}
          <div className="absolute inset-0 flex flex-col">
            {hours.map((h) => (
              <div
                key={h}
                className={`w-full border-b box-border ${
                  theme(darkMode).gridLine
                }`}
                style={{ height: HOUR_HEIGHT }}
              ></div>
            ))}
          </div>

          {/* COLUMNS */}
          <div className="absolute inset-0 flex">
            {visibleDays.map((_, i) => {
              const dayIndex = getRealDayIndex(i);
              return (
                <div
                  key={i}
                  className={`flex-1 border-r last:border-0 relative min-w-[100px] group ${
                    theme(darkMode).border
                  }`}
                >
                  {events
                    .filter((e) => e.dayIndex === dayIndex)
                    .map((event) => {
                      const startH = parseInt(event.start.split(":")[0]);
                      if (startH < startHour || startH >= endHour) return null;
                      const styleClass = darkMode
                        ? eventConfig[event.type].dark
                        : eventConfig[event.type].light;

                      return (
                        <div
                          key={event.id}
                          className={`absolute inset-x-1 rounded-md px-2 py-1 border-l-4 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden z-10 group-hover:z-20 ${styleClass}`}
                          style={getEventStyle(event.start, event.end)}
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
                  {timeIndicator && timeIndicator.dayIndex === dayIndex && (
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
