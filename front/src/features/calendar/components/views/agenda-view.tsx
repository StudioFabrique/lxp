import { useMemo } from "react";
import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { cn } from "../../../../utils/cn";
import { CalendarEvent, CalendarView, eventConfig, theme } from "../calendar-configuration";
import { getWeekBounds, isSameDate } from "../calendar-utils";

type Props = {
  events: CalendarEvent[];
  view: CalendarView;
  currentDate: Date;
  onClickEventDetails?: (id: number | string, rect: DOMRect, element?: HTMLElement) => void;
};

/** Sans horaire d'abord, puis par heure de début. */
const byTime = (a: CalendarEvent, b: CalendarEvent): number =>
  Number(Boolean(b.allDay)) - Number(Boolean(a.allDay)) || a.start.localeCompare(b.start);

/**
 * Affichage du calendrier sur mobile : une liste par jour (la semaine, ou le seul jour affiché) au lieu de sept colonnes
 * illisibles. Chaque cours est une ligne avec son horaire, son titre et son sous-titre ; les jours vides restent
 * visibles, repliés sur une ligne.
 */
export default function AgendaView({ events, view, currentDate, onClickEventDetails }: Props) {
  const today = new Date();
  const days = useMemo(() => {
    const first = view === "week" ? getWeekBounds(currentDate).firstDay : currentDate;
    return Array.from({ length: view === "week" ? 7 : 1 }, (_, index) => {
      const date = new Date(first);
      date.setDate(date.getDate() + index);
      const dayIndex = (date.getDay() + 6) % 7;
      const dayEvents = events
        .filter((event) => (event.date ? isSameDate(event.date, date) : event.dayIndex === dayIndex))
        .sort(byTime);
      return { date, events: dayEvents };
    });
  }, [events, view, currentDate]);

  return (
    <div aria-label={view === "day" ? "Cours du jour" : "Cours de la semaine"} className="flex flex-col gap-3 p-3">
      {days.map(({ date, events: dayEvents }) => {
        const isToday = isSameDate(date, today);
        const label = date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

        return (
          <section key={date.toDateString()} aria-label={label} className="flex flex-col items-center gap-1.5">
            <h3
              // Le jour courant se repère à sa couleur ; les technologies d'assistance l'annoncent via `aria-current`.
              aria-current={isToday ? "date" : undefined}
              className={cn(
                "text-center text-sm font-bold capitalize",
                isToday ? theme.todayText : theme.text,
              )}
            >
              {label}
            </h3>
            {dayEvents.length === 0 ? (
              <p className="text-center text-xs text-base-content/60">Aucun cours</p>
            ) : (
              <ul className="flex w-full flex-col gap-1.5">
                {dayEvents.map((event) => (
                  <li key={event.id}>
                    <button
                      type="button"
                      data-calendar-event={event.id}
                      className={cn(
                        "flex w-full items-stretch gap-3 rounded-lg border-l-4 p-2 text-left shadow-sm",
                        eventConfig[event.type],
                      )}
                      onClick={(clickEvent) =>
                        onClickEventDetails?.(
                          event.id,
                          clickEvent.currentTarget.getBoundingClientRect(),
                          clickEvent.currentTarget,
                        )
                      }
                    >
                      <span className="flex w-12 shrink-0 flex-col justify-center text-xs font-semibold tabular-nums">
                        {event.allDay ? (
                          <span>Journée</span>
                        ) : event.category === "assignment" ? (
                          <>
                            <span className="text-[10px] font-normal opacity-80">À rendre</span>
                            <span>{event.deadlineTime}</span>
                          </>
                        ) : (
                          <>
                            <span>{event.start}</span>
                            <span className="font-normal opacity-70">{event.end}</span>
                          </>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 break-words text-sm font-bold leading-tight">
                          {formatTitle(event.title)}
                        </span>
                        {event.subtitle && (
                          <span className="block truncate text-xs opacity-80">{event.subtitle}</span>
                        )}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
