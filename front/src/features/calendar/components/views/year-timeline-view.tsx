import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { useMemo } from "react";
import { ArrowRight, CalendarPlus } from "lucide-react";
import { theme, TimelineEvent } from "../calendar-configuration";
import { formatDate } from "../calendar-utils";
import { cn } from "../../../../utils/cn";
import EmptyStatePlaceholder from "../../../../components/UI/empty-state-placeholder";

type Props = {
  events: TimelineEvent[];
  onClickEdit?: (id: number | string) => void;
  onClickDetails?: (id: number | string, rect: DOMRect, element?: HTMLElement) => void;
};

const YearTimelineView = ({
  events,
  onClickEdit,
  onClickDetails,
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

    if (startTimes.length === 0 || endTimes.length === 0) return { min: 0, max: 0, total: 0 };

    const min = Math.min(...startTimes);
    const max = Math.max(min, ...endTimes);
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
      <EmptyStatePlaceholder
        title="Aucun événement à afficher"
        withBorder={false}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden select-none relative">
      {/* --- HEADER --- */}
      {range.min + range.max > 0 && (
        <div
          className={cn("flex justify-between items-center px-4 h-10 border-b flex-shrink-0 text-xs font-bold uppercase tracking-wider z-20 relative", theme.headerBg, theme.border, theme.subText)}
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
            <div className="w-48 gap-4 flex-shrink-0 mr-4"></div>

            {/* The Timeline Area */}
            <div className="flex-1 relative h-full">
              <div
                className="absolute top-0 bottom-0 border-l-2 border-primary/60 dashed"
                style={{ left: `${todayPosition}%` }}
              >
                {/* Badge Label */}
                <div
                  className={`absolute -top-2 -translate-x-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded text-primary-content shadow-sm bg-primary`}
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

            // Un module sans dates est attribuable d'un clic sur toute sa ligne.
            const canAssignDates = !(event.startDate && event.endDate) && Boolean(onClickEdit);

            return (
              <div
                key={event.id}
                className={cn(
                  "relative flex items-center gap-4 group rounded-lg p-2 transition-all duration-200 hover:bg-primary/10 hover:shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] focus-within:bg-primary/10",
                  // Emplacement à remplir : bordure en pointillés, qui devient pleine et se soulève au survol.
                  canAssignDates &&
                    "cursor-pointer border border-dashed border-base-content/25 bg-base-100/30 p-3 hover:-translate-y-0.5 hover:border-solid hover:border-primary/60 hover:shadow-lg",
                )}
              >
                {/* LEFT: Info */}
                <button
                  type="button"
                  aria-label={canAssignDates ? `Attribuer des dates à ${formatTitle(event.title)}` : undefined}
                  onClick={(e) =>
                    canAssignDates
                      ? onClickEdit?.(event.id)
                      : onClickDetails?.(
                          event.id,
                          e.currentTarget.getBoundingClientRect(),
                          e.currentTarget,
                        )
                  }
                  className={cn(
                    "w-48 flex items-center gap-3 flex-shrink-0 cursor-pointer text-left",
                    // Étend la zone cliquable à toute la ligne.
                    canAssignDates && "after:absolute after:inset-0 after:rounded-lg after:content-['']",
                  )}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden border border-base-content/30 flex-shrink-0 bg-base-content/15"
                  >
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={formatTitle(event.title)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold opacity-50">
                        {event.title?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div
                    className={
                      cn(event.startDate && event.endDate
                        ? "min-w-0"
                        : "max-w-[15vw]")
                    }
                  >
                    <div
                      className={cn("text-sm font-semibold truncate transition-colors group-hover:text-primary", theme.text)}
                    >
                      {formatTitle(event.title)}
                    </div>
                    {event.startDate && event.endDate && (
                      <div
                        className={cn("text-[10px] truncate group-hover:text-base-content", theme.subText)}
                      >
                        {`${formatDate(event.startDate)} - ${formatDate(
                          event.endDate
                        )}`}
                      </div>
                    )}
                  </div>
                </button>

                {/* RIGHT: Bar */}
                {event.startDate && event.endDate ? (
                  // Toute la piste déclenche la barre (le clic ne cible pas la barre précisément), dont l'animation suit le survol de la ligne entière.
                  <div
                    className="flex-1 relative self-stretch min-h-8 flex items-center cursor-pointer"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) return;
                      e.currentTarget.querySelector("button")?.click();
                    }}
                  >
                    {/* Background Track */}
                    <div
                      className="absolute w-full h-[1px] rounded bg-base-300"
                    ></div>

                    {/* Event Bar */}
                    <button
                      type="button"
                      aria-label={`Détails de ${formatTitle(event.title)}`}
                      onClick={e => onClickEdit ? onClickEdit(event.id) : onClickDetails?.(event.id, e.currentTarget.getBoundingClientRect(), e.currentTarget)}
                      className="absolute h-4 rounded-full bg-primary shadow-sm cursor-pointer transition-all duration-200 opacity-90 group-hover:h-5 group-hover:opacity-100 flex items-center"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                      title={`${formatTitle(event.title)}`}
                    >
                      {widthPercent > 3 && (
                        <span className="text-[10px] text-primary-content font-medium px-2 truncate drop-shadow-md">
                          {formatTitle(event.title)}
                        </span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className={cn("flex items-center justify-end gap-5 w-full", canAssignDates ? "mr-2" : "mr-10")}>
                    {canAssignDates ? (
                      <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <CalendarPlus className="size-4" aria-hidden="true" />
                        Attribuer des dates
                        <ArrowRight
                          className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    ) : (
                      // En lecture seule, rien ne permet d'attribuer : on signale seulement l'absence de dates.
                      <span className="text-xs text-base-content">
                        Date manquante
                      </span>
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
