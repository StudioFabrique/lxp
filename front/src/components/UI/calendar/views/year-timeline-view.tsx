import { useMemo } from "react";
import { theme, TimelineEvent } from "../calendar-configuration";

type Props = {
  events: TimelineEvent[];
  darkMode: boolean;
};

const YearTimelineView = ({ events, darkMode }: Props) => {
  // 1. Calculate the global Edge-to-Edge range (Min Start -> Max End)
  const range = useMemo(() => {
    if (events.length === 0) return { min: 0, max: 0, total: 0 };

    const startTimes = events
      .map((e) => e.startDate?.getTime())
      .filter((date) => date !== undefined);
    const endTimes = events
      .map((e) => e.endDate?.getTime())
      .filter((date) => date !== undefined);

    const min = Math.min(...startTimes);
    const max = Math.max(...endTimes);

    // Add a 1-day buffer if min equals max to avoid division by zero
    const total = max === min ? 86400000 : max - min;

    return { min, max, total };
  }, [events]);

  // Helper to format date for tooltips/labels
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric", // "4"
      month: "long", // "janvier"
      year: "numeric", // "2026"
    });
  };

  if (events.length === 0) {
    return (
      <div
        className={`flex items-center justify-center h-full my-10 ${
          theme(darkMode).subText
        }`}
      >
        Aucun événements à afficher
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden select-none">
      {/* --- HEADER (Global Time Axis) --- */}
      {range.min + range.max > 0 && (
        <div
          className={`flex justify-between items-center px-4 h-10 border-b flex-shrink-0 text-xs font-bold uppercase tracking-wider ${
            theme(darkMode).headerBg
          } ${theme(darkMode).border} ${theme(darkMode).subText}`}
        >
          <span>du {formatDate(new Date(range.min))}</span>
          <span>au {formatDate(new Date(range.max))}</span>
        </div>
      )}

      {/* --- SCROLLABLE BODY --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {events.map((event) => {
          // Calculate dimensions
          const startOffset = event.startDate
            ? event.startDate.getTime() - range.min
            : 0;
          const duration =
            event.endDate && event.startDate
              ? event.endDate.getTime() - event.startDate.getTime()
              : 0;

          // Convert to percentages
          const leftPercent = (startOffset / range.total) * 100;
          // Ensure at least 0.5% width so short events are visible
          const widthPercent = Math.max((duration / range.total) * 100, 0.5);

          return (
            <div
              key={event.id}
              className={`flex items-center gap-4 group rounded-lg p-2 transition-colors ${
                darkMode ? "hover:bg-slate-800/50" : "hover:bg-gray-50"
              }`}
            >
              {/* LEFT: Avatar + Title Info */}
              <div className="w-48 flex items-center gap-3 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border flex-shrink-0 ${
                    theme(darkMode).border
                  } ${darkMode ? "bg-slate-700" : "bg-gray-200"}`}
                >
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold opacity-50">
                      {event.title.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-sm font-semibold truncate ${
                      theme(darkMode).text
                    }`}
                  >
                    {event.title}
                  </div>
                  {event.startDate && event.endDate && (
                    <div
                      className={`text-[10px] truncate ${
                        theme(darkMode).subText
                      }`}
                    >
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Timeline Bar Area */}
              {event.startDate && event.endDate ? (
                <div className="flex-1 relative h-8 flex items-center">
                  {/* Background Track Line */}
                  <div
                    className={`absolute w-full h-[1px] rounded ${
                      darkMode ? "bg-slate-700" : "bg-gray-200"
                    }`}
                  ></div>

                  {/* The Event Bar */}
                  <div
                    className="absolute h-4 rounded-full shadow-sm cursor-pointer hover:h-5 transition-all duration-200 opacity-90 hover:opacity-100 flex items-center"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      // Using a nice gradient logic, or you can pass a color in the event object
                      background: darkMode
                        ? "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"
                        : "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                    }}
                    title={`${event.title}: ${formatDate(
                      event.startDate
                    )} - ${formatDate(event.endDate)}`}
                  >
                    {/* Optional: Label inside bar if wide enough */}
                    {widthPercent > 10 && (
                      <span className="text-[10px] text-white font-medium px-2 truncate drop-shadow-md">
                        {event.title}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-end gap-5 w-full mr-10">
                  <span>Cet événement n'a pas encore de date</span>
                  <button className="btn btn-sm btn-outline">
                    Attribuer une date
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearTimelineView;
