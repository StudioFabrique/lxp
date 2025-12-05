import { daysOfWeek, monthNames, theme } from "../calendar-configuration";

type Props = {
  darkMode: boolean;
};

const MonthView = ({ darkMode }: Props) => {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Month Header */}
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

      {/* Month Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 auto-rows-fr overflow-y-auto">
        {days.map((d, idx) => {
          // Mapping Logic: In this generic calendar, we map events by dayIndex (0=Mon, etc.)
          // So every Monday gets the Monday events.
          const dayIndex = idx % 7;
          const dayEvents = d.currentMonth
            ? events.filter((e) => e.dayIndex === dayIndex)
            : [];

          const isToday =
            d.currentMonth &&
            d.day === nowTime.getDate() &&
            currentDate.getMonth() === nowTime.getMonth() &&
            currentDate.getFullYear() === nowTime.getFullYear();

          return (
            <div
              key={idx}
              className={`border-b border-r min-h-[100px] p-1 flex flex-col gap-1 transition-colors
                  ${theme.border}
                  ${
                    !d.currentMonth
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
              {d.currentMonth && (
                <div
                  className={`text-right text-xs font-bold mb-1 ${
                    isToday ? "text-blue-500" : theme.subText
                  }`}
                >
                  {d.day === 1
                    ? `${d.day} ${monthNames[currentDate.getMonth()].substring(
                        0,
                        3
                      )}.`
                    : d.day}
                </div>
              )}

              {dayEvents.map((event) => {
                const styleClass = darkMode
                  ? eventConfig[event.type].dark
                  : eventConfig[event.type].light;
                return (
                  <div
                    key={event.id}
                    className={`text-[10px] px-1.5 py-0.5 rounded border-l-2 truncate font-medium cursor-pointer ${styleClass}`}
                  >
                    <span className="opacity-75 mr-1">{event.start}</span>
                    {event.title}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
