import { useEffect, useMemo, useState } from "react";
import { CalendarEvent, CalendarView, eventConfig, theme } from "../calendar-configuration";
import { getCurrentTimeIndicator, getEventStyle, getWeekBounds, isSameDate } from "../calendar-utils";
import { layoutDayEvents, minutes } from "../read-calendar-utils";

type Props = {
  events: CalendarEvent[];
  onSelectDay?: (date: Date) => void;
  view: CalendarView;
  currentDate: Date;
  startHour: number;
  endHour: number;
  darkMode: boolean;
  currentWeekDayVisible: boolean;
  style?: { hourHeight: number };
  onClickEventDetails?: (id: number | string, rect: DOMRect) => void;
  onShowMore?: (events: CalendarEvent[]) => void;
};

export default function TimelineView({ onSelectDay, events, view, currentDate, startHour, endHour, darkMode, currentWeekDayVisible, style = { hourHeight: 60 }, onClickEventDetails, onShowMore }: Props) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = setInterval(() => setNow(new Date()), 60_000); return () => clearInterval(timer); }, []);
  const days = useMemo(() => {
    const first = view === "week" ? getWeekBounds(currentDate).firstDay : currentDate;
    return Array.from({ length: view === "week" ? 7 : 1 }, (_, index) => {
      const date = new Date(first); date.setDate(date.getDate() + index);
      const dayIndex = (date.getDay() + 6) % 7;
      return { date, ...layoutDayEvents(events.filter(event => event.date ? isSameDate(event.date, date) : event.dayIndex === dayIndex)) };
    });
  }, [events, view, currentDate]);
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const indicator = getCurrentTimeIndicator(now, startHour, endHour, style);
  const hasHeader = view === "week" || currentWeekDayVisible;
  const hasUntimed = days.some(day => day.allDay.length || day.hidden.length);
  const eventClass = (event: CalendarEvent) => darkMode ? eventConfig[event.type].dark : eventConfig[event.type].light;
  const clickEvent = (event: CalendarEvent, target: HTMLElement) => onClickEventDetails?.(event.id, target.getBoundingClientRect());
  return <div className="overflow-auto max-h-[75vh]" aria-label={view === "day" ? "Cours du jour" : "Cours de la semaine"}>
    <div data-calendar-scroll-content className={view === "week" ? "min-w-[700px]" : "min-w-full"}>
      {hasHeader && <div className={`sticky top-0 z-30 flex border-b ${theme(darkMode).headerBg} ${theme(darkMode).border}`}>
        <div className="w-16 shrink-0" />
        {days.map(({ date }) => {
          const label = date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
          const className = `min-w-0 flex-1 p-2 text-center text-sm font-bold ${isSameDate(date, now) ? "text-primary" : ""}`;
          return view === "week" && onSelectDay
            ? <button key={date.toDateString()} type="button" className={`${className} cursor-pointer hover:bg-primary/10 focus-visible:outline-primary`}
                aria-label={`Voir le ${date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} en vue Jour`}
                onClick={() => onSelectDay(new Date(date))}>{label}</button>
            : <div key={date.toDateString()} className={className}>{label}</div>;
        })}
      </div>}
      {hasUntimed && <div className="flex border-b border-base-300 bg-base-100">
        <div className="w-16 shrink-0 p-2 text-xs text-base-content/60">Sans horaire</div>
        {days.map(day => <div key={day.date.toDateString()} className="min-w-0 flex-1 space-y-1 border-r border-base-300 p-1">
          {day.allDay.slice(0, 2).map(event => <button key={event.id} type="button" className={`block w-full truncate rounded border-l-2 p-1 text-left text-xs ${eventClass(event)}`} onClick={e => clickEvent(event, e.currentTarget)}>{event.title}</button>)}
          {day.allDay.length > 2 && <button type="button" className="block text-xs text-primary hover:underline" onClick={() => onShowMore?.(day.allDay.slice(2))}>Afficher plus ({day.allDay.length - 2})</button>}
          {day.hidden.length > 0 && <button type="button" className="block text-left text-xs text-primary hover:underline" onClick={() => onShowMore?.(day.hidden)}>Afficher plus ({day.hidden.length}) · cours superposés</button>}
        </div>)}
      </div>}
      <div className="flex" style={{ height: hours.length * style.hourHeight }}>
        <div className="sticky left-0 z-20 w-16 shrink-0 border-r border-base-300 bg-base-100">
          {hours.map(hour => <div key={hour} className="pr-2 pt-1 text-right text-xs text-base-content/60" style={{ height: style.hourHeight }}>{hour}:00</div>)}
        </div>
        {days.map(day => <div key={day.date.toDateString()} className="relative min-w-0 flex-1 border-r border-base-300">
          {hours.map(hour => <div key={hour} className="border-b border-base-300/60" style={{ height: style.hourHeight }} />)}
          {day.visible.map(({ event, lane, columns }) => {
            if (minutes(event.end) <= startHour * 60 || minutes(event.start) >= endHour * 60) return null;
            const start = minutes(event.start) < startHour * 60 ? `${startHour}:00` : event.start;
            const end = minutes(event.end) > endHour * 60 ? `${endHour}:00` : event.end;
            return <button key={event.id} type="button" data-calendar-event={event.id}
              className={`absolute z-10 flex flex-col items-stretch justify-start overflow-hidden rounded-md border-l-4 px-1.5 py-1 text-left shadow-sm hover:z-20 hover:shadow-md focus:z-20 ${eventClass(event)}`}
              style={{ ...getEventStyle(start, end, startHour, style), left: `calc(${lane * 100 / columns}% + 2px)`, width: `calc(${100 / columns}% - 4px)` }}
              title={`${event.title} · ${event.start} – ${event.end}`}
              onClick={e => clickEvent(event, e.currentTarget)}>
              <div className="line-clamp-3 break-words text-xs font-bold leading-tight">{event.title}</div>
              <div className="truncate text-[10px]">{event.start} – {event.end}</div>
              {event.subtitle && <div className="truncate text-[10px] opacity-80">{event.subtitle}</div>}
            </button>;
          })}
          {indicator && isSameDate(day.date, now) && <div className="pointer-events-none absolute z-20 w-full border-t-2 border-error" style={{ top: indicator.top }} />}
        </div>)}
      </div>
    </div>
  </div>;
}
