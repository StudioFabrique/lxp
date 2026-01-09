import { useMemo } from "react";
import {
  CalendarEvent,
  daysOfWeek,
  eventConfig,
  monthNames,
  theme,
} from "../calendar-configuration";
import { getMonthDays, isSameDate } from "../calendar-utils";

type Props = {
  events: CalendarEvent[];
  currentDate: Date;
  darkMode: boolean;
  onClickEventDetails?: (id: number | string, rect: DOMRect) => void;
};

const MonthView = ({
  events,
  currentDate,
  darkMode,
  onClickEventDetails,
}: Props) => {
  const days = useMemo(() => {
    return getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  }, [currentDate]);

  const now = new Date();

  return (
    <div className="select-none flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div
        className={`grid grid-cols-7 h-10 border-b ${
          theme(darkMode).headerBg
        } ${theme(darkMode).border}`}
      >
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className={`flex items-center justify-center font-bold text-sm ${
              theme(darkMode).subText
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr overflow-y-auto">
        {days.map((cell, idx) => {
          // --- LOGIC START ---
          const cellDate = cell.date;
          // Calculate 0-6 index for this specific cell (0=Mon, 6=Sun)
          let cellDayIndex = cellDate.getDay() - 1;
          if (cellDayIndex === -1) cellDayIndex = 6;

          const dayEvents = events.filter((event) => {
            if (event.date) {
              // 1. One-off Event: Check exact date match
              return isSameDate(event.date, cellDate);
            } else {
              // 2. Recurring Event: Check day index match (only if displayed in valid context)
              // Note: You might want to hide recurring events from previous/next months
              // to reduce noise, but standard calendars usually show them.
              return event.dayIndex === cellDayIndex;
            }
          });
          // --- LOGIC END ---

          const isToday = isSameDate(cellDate, now);

          return (
            <div
              key={idx}
              className={`border-b border-r min-h-[80px] p-1 flex flex-col gap-1 transition-colors
                  ${theme(darkMode).border}
                  ${
                    !cell.currentMonth
                      ? darkMode
                        ? "bg-slate-900/50 opacity-30"
                        : "bg-gray-50 text-gray-400"
                      : ""
                  }
                  ${
                    isToday ? (darkMode ? "bg-slate-800" : "bg-blue-50/30") : ""
                  }
                `}
            >
              <div
                className={`text-right text-xs font-bold mb-1 ${
                  isToday ? "text-blue-500" : theme(darkMode).subText
                }`}
              >
                {cell.date.getDate() === 1
                  ? `${cell.date.getDate()} ${monthNames[
                      cell.date.getMonth()
                    ].substring(0, 3)}.`
                  : cell.date.getDate()}
              </div>

              <div className="flex flex-col gap-1 overflow-y-auto max-h-[100px] no-scrollbar">
                {dayEvents.map((event) => {
                  const styleClass = darkMode
                    ? eventConfig[event.type].dark
                    : eventConfig[event.type].light;
                  return (
                    <div
                      key={`${event.id}-${idx}`}
                      onClick={(e) =>
                        onClickEventDetails?.(
                          event.id,
                          e.currentTarget.getBoundingClientRect()
                        )
                      }
                      className={`text-[10px] px-1.5 py-0.5 rounded border-l-2 truncate font-medium cursor-pointer ${styleClass}`}
                      title={event.title}
                    >
                      <span className="opacity-75 mr-1 hidden lg:inline">
                        {event.start}
                      </span>
                      {event.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
