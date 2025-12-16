import { useMemo } from "react";
import { theme, TimelineEvent } from "../calendar-configuration";
import { formatDate } from "../calendar-utils";

type Props = {
  events: TimelineEvent[];
  onClickEdit?: (id: number | string) => void;
  onClickDetails?: (id: number | string, rect: DOMRect) => void;
  darkMode: boolean;
};

const YearTimelineView = ({
  events,
  onClickEdit,
  onClickDetails,
  darkMode,
}: Props) => {
  // Sort events: Closest (Earliest) -> Farthest (Latest)
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const startA = a.startDate
        ? a.startDate.getTime()
        : Number.MAX_SAFE_INTEGER;
      const startB = b.startDate
        ? b.startDate.getTime()
        : Number.MAX_SAFE_INTEGER;

      if (startA !== startB) return startA - startB;

      const endA = a.endDate ? a.endDate.getTime() : Number.MAX_SAFE_INTEGER;
      const endB = b.endDate ? b.endDate.getTime() : Number.MAX_SAFE_INTEGER;
      return endA - endB;
    });
  }, [events]);

  // Calculate the global Edge-to-Edge range
  const range = useMemo(() => {
    if (events.length === 0) return { min: 0, max: 0, total: 0 };

    const startTimes = events
      .map((e) => e.startDate?.getTime())
      .filter((date) => date !== undefined) as number[];
    const endTimes = events
      .map((e) => e.endDate?.getTime())
      .filter((date) => date !== undefined) as number[];

    if (startTimes.length === 0) return { min: 0, max: 0, total: 0 };

    const min = Math.min(...startTimes);
    const max = Math.max(...endTimes);
    const total = max === min ? 86400000 : max - min;

    return { min, max, total };
  }, [events]);

  // Calculate "Today" position
  const todayPosition = useMemo(() => {
    if (range.total === 0) return null;
    const now = new Date().getTime();
    const percent = ((now - range.min) / range.total) * 100;

    // Only show if today is within (or close to) the range
    if (percent < 0 || percent > 100) return null;
    return percent;
  }, [range]);

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
    <div className="flex flex-col flex-1 h-full overflow-hidden select-none relative">
      {/* --- HEADER --- */}
      {range.min + range.max > 0 && (
        <div
          className={`flex justify-between items-center px-4 h-10 border-b flex-shrink-0 text-xs font-bold uppercase tracking-wider z-20 relative ${
            theme(darkMode).headerBg
          } ${theme(darkMode).border} ${theme(darkMode).subText}`}
        >
          <span>du {formatDate(new Date(range.min))}</span>
          <span>au {formatDate(new Date(range.max))}</span>
        </div>
      )}

      {/* --- SCROLLABLE BODY --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {/* --- TODAY INDICATOR OVERLAY --- */}
        {todayPosition !== null && (
          <div className="absolute inset-0 pointer-events-none flex p-4 z-50">
            {/* Spacer to match the Avatar column width (w-48 + gap-4) */}
            <div className="w-48 gap-4 flex-shrink-0 mr-4"></div>

            {/* The Timeline Area */}
            <div className="flex-1 relative h-full">
              <div
                className="absolute top-0 bottom-0 border-l-2 border-rose-500/50 dashed"
                style={{ left: `${todayPosition}%` }}
              >
                {/* Badge Label */}
                <div
                  className={`absolute -top-2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded text-white shadow-sm bg-primary`}
                >
                  Aujourd'hui
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- EVENTS LIST --- */}
        <div className="relative z-10 space-y-4">
          {sortedEvents.map((event) => {
            const startOffset = event.startDate
              ? event.startDate.getTime() - range.min
              : 0;
            const duration =
              event.endDate && event.startDate
                ? event.endDate.getTime() - event.startDate.getTime()
                : 0;
            const safeTotal = range.total > 0 ? range.total : 1;
            const leftPercent = (startOffset / safeTotal) * 100;
            const widthPercent = Math.max((duration / safeTotal) * 100, 0.5);

            return (
              <div
                key={event.id}
                className={`flex items-center gap-4 group rounded-lg p-2 transition-colors ${
                  darkMode ? "hover:bg-slate-800/50" : "hover:bg-gray-50"
                }`}
              >
                {/* LEFT: Info */}
                <div
                  onClick={(e) =>
                    onClickDetails?.(
                      event.id,
                      e.currentTarget.getBoundingClientRect()
                    )
                  }
                  className="w-48 flex items-center gap-3 flex-shrink-0 cursor-pointer"
                >
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
                  <div
                    className={
                      event.startDate && event.endDate
                        ? "min-w-0"
                        : "max-w-[15vw]"
                    }
                  >
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
                        {`${formatDate(event.startDate)} - ${formatDate(
                          event.endDate
                        )}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Bar */}
                {event.startDate && event.endDate ? (
                  <div
                    className="flex-1 relative h-8 flex items-center"
                    onClick={() => onClickEdit?.(event.id)}
                  >
                    {/* Background Track */}
                    <div
                      className={`absolute w-full h-[1px] rounded ${
                        darkMode ? "bg-slate-700" : "bg-gray-200"
                      }`}
                    ></div>

                    {/* Event Bar */}
                    <div
                      className="absolute h-4 rounded-full shadow-sm cursor-pointer hover:h-5 transition-all duration-200 opacity-90 hover:opacity-100 flex items-center"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                        background: darkMode
                          ? "linear-gradient(90deg, #6366f1 0%, #a855f7 100%)"
                          : "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
                      }}
                      title={`${event.title}`}
                    >
                      <span className="text-[10px] text-white font-medium px-2 truncate drop-shadow-md">
                        {event.title}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-end gap-5 w-full mr-10 opacity-60">
                    <span className={`text-xs ${theme(darkMode).subText}`}>
                      Date manquante
                    </span>
                    {onClickEdit && (
                      <button
                        className="btn btn-sm btn-ghost border text-xs h-8 min-h-0"
                        onClick={() => onClickEdit(event.id)}
                      >
                        Attribuer
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YearTimelineView;
