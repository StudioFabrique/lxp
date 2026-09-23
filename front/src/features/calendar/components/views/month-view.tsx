import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { useMemo } from "react";
import {
  CalendarEvent,
  daysOfWeek,
  eventConfig,
  monthNames,
  theme,
} from "../calendar-configuration";
import { getMonthDays, isSameDate } from "../calendar-utils";
import { cn } from "../../../../utils/cn";

type Props = {
  events: CalendarEvent[];
  onSelectDay?: (date: Date) => void;
  onShowMore: (events: CalendarEvent[]) => void;
  currentDate: Date;
  onClickEventDetails?: (
    id: number | string,
    rect: DOMRect,
    element?: HTMLElement,
  ) => void;
};

const MonthView = ({
  events,
  onSelectDay,
  onShowMore,
  currentDate,
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
        className={cn("grid grid-cols-7 h-10 border-b", theme.headerBg, theme.border)}
      >
        {daysOfWeek.map((d) => (
          <div
            key={d}
            className={cn("flex items-center justify-center font-bold text-sm", theme.subText)}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 auto-rows-fr overflow-y-auto">
        {days.map((cell, idx) => {
          const cellDate = cell.date;
          // Calculate 0-6 index for this specific cell (0=Mon, 6=Sun)
          let cellDayIndex = cellDate.getDay() - 1;
          if (cellDayIndex === -1) cellDayIndex = 6;

          const dayEvents = events.filter((event) => {
            if (event.date) {
              // One-off Event: Check exact date match
              return isSameDate(event.date, cellDate);
            } else {
              // Recurring Event: Check day index match (only if displayed in valid context)
              return event.dayIndex === cellDayIndex;
            }
          });

          const isToday = isSameDate(cellDate, now);

          return (
            <div
              key={idx}
              onClick={(event) => {
                if (!(event.target as HTMLElement).closest("button"))
                  onSelectDay?.(new Date(cellDate));
              }}
              className={cn("border-b border-r min-h-20 p-1 flex flex-col gap-1 transition-colors", theme.border, onSelectDay && "cursor-pointer hover:bg-primary/5", !cell.currentMonth && "bg-base-200 text-base-content/40", isToday && theme.todayBg)}
            >
              <button
                type="button"
                aria-label={`Voir le ${cellDate.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} en vue Jour`}
                onClick={() => onSelectDay?.(new Date(cellDate))}
                className={cn("self-end rounded px-1 text-right text-xs font-bold mb-1 hover:bg-primary/10 focus-visible:outline-primary", isToday ? theme.todayText : theme.subText)}
              >
                {cell.date.getDate() === 1
                  ? `${cell.date.getDate()} ${monthNames[
                      cell.date.getMonth()
                    ].substring(0, 3)}.`
                  : cell.date.getDate()}
              </button>

              <div className="flex flex-col gap-1 overflow-y-auto max-h-25 no-scrollbar">
                {dayEvents.slice(0, 2).map((event) => {
                  const styleClass = eventConfig[event.type];
                  return (
                    <button
                      type="button"
                      key={`${event.id}-${idx}`}
                      onClick={(e) =>
                        onClickEventDetails?.(
                          event.id,
                          e.currentTarget.getBoundingClientRect(),
                          e.currentTarget,
                        )
                      }
                      className={cn("text-left text-[10px] px-1.5 py-0.5 rounded border-l-2 truncate font-medium cursor-pointer", styleClass)}
                      title={formatTitle(event.title)}
                    >
                      <span className="opacity-75 mr-1 hidden lg:inline">
                        {event.category === "assignment"
                          ? (event.deadlineTime ?? event.start)
                          : event.allDay
                            ? "Sans horaire - "
                            : event.start}
                      </span>
                      {formatTitle(event.title)}
                    </button>
                  );
                })}
                {dayEvents.length > 2 && (
                  <button
                    type="button"
                    className="text-left text-xs text-primary hover:underline"
                    onClick={() => onShowMore(dayEvents.slice(2))}
                  >
                    Afficher plus ({dayEvents.length - 2})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
