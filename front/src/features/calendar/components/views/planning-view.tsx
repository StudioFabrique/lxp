import { useRef, useState, type PointerEvent } from "react";
import { daysOfWeek, theme, type TimelineEvent } from "../calendar-configuration";
import { formatDate, getMonthDays, isSameDate } from "../calendar-utils";
import { calendarDay, changePlanningDates, type PlanningGesture } from "../planning-utils";

type Props = {
  events: TimelineEvent[];
  currentDate: Date;
  darkMode: boolean;
  selectedEventId?: number | string;
  disabled?: boolean;
  onClickDetails?: (id: number | string, rect: DOMRect) => void;
  onChangeDates?: (id: number | string, startDate: Date, endDate: Date) => void;
};

type Gesture = {
  event: TimelineEvent;
  mode: PlanningGesture;
  origin: number;
  x: number;
  y: number;
  moved: boolean;
  preview: TimelineEvent;
  rect: DOMRect;
};

export default function PlanningView({ events, currentDate, darkMode, selectedEventId, disabled, onClickDetails, onChangeDates }: Props) {
  const days = getMonthDays(currentDate.getFullYear(), currentDate.getMonth());
  const weeks = Array.from({ length: 6 }, (_, index) => days.slice(index * 7, index * 7 + 7));
  const surface = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const gesture = useRef<Gesture | null>(null);
  const suppressClick = useRef(false);
  const [preview, setPreview] = useState<TimelineEvent | null>(null);
  const colors = theme(darkMode);

  const dayAtPointer = (x: number, y: number) => {
    for (const [index, row] of rows.current.entries()) {
      const rect = row?.getBoundingClientRect();
      if (!rect || y < rect.top || y > rect.bottom || rect.width === 0) continue;
      const column = Math.max(0, Math.min(6, Math.floor((x - rect.left) / (rect.width / 7))));
      return calendarDay(weeks[index][column].date);
    }
    return null;
  };

  const begin = (e: PointerEvent<HTMLDivElement>, event: TimelineEvent) => {
    if (disabled || !onChangeDates || e.button !== 0) return;
    const origin = dayAtPointer(e.clientX, e.clientY);
    if (origin === null) return;
    const handle = (e.target as HTMLElement).closest<HTMLElement>("[data-resize]");
    const mode = (handle?.dataset.resize as PlanningGesture | undefined) ?? "move";
    suppressClick.current = false;
    gesture.current = {
      event,
      mode,
      origin,
      x: e.clientX,
      y: e.clientY,
      moved: false,
      preview: event,
      rect: e.currentTarget.getBoundingClientRect()
    };
    surface.current?.setPointerCapture(e.pointerId);
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const active = gesture.current;
    if (!active) return;
    if (Math.hypot(e.clientX - active.x, e.clientY - active.y) < 4 && !active.moved) return;
    active.moved = true;
    const day = dayAtPointer(e.clientX, e.clientY);
    if (day === null) return;
    active.preview = changePlanningDates(active.event, active.mode, day - active.origin);
    setPreview(active.preview);
  };

  const finish = (cancelled = false) => {
    const active = gesture.current;
    gesture.current = null;
    setPreview(null);
    suppressClick.current = Boolean(active?.moved);
    if (!cancelled && active && !active.moved) {
      onClickDetails?.(active.event.id, active.rect);
    }
    if (!cancelled && active?.moved && active.preview.startDate && active.preview.endDate &&
      (active.preview.startDate.getTime() !== active.event.startDate?.getTime() ||
        active.preview.endDate.getTime() !== active.event.endDate?.getTime())) {
      onChangeDates?.(active.event.id, active.preview.startDate, active.preview.endDate);
    }
  };

  const visibleEvents = events.map(event => preview?.id === event.id ? preview : event);
  return (
    <div ref={surface} className="overflow-x-auto" aria-label="Calendrier mensuel des cours" aria-busy={disabled}
      onPointerMove={move} onPointerUp={() => finish()} onPointerCancel={() => finish(true)}
      onLostPointerCapture={() => { if (gesture.current) finish(true); }}>
      <div className="min-w-[560px] select-none">
        <div className={`grid grid-cols-7 border-b ${colors.border} ${colors.headerBg}`}>
          {daysOfWeek.map(day => <div key={day} className={`py-2 text-center text-xs font-semibold ${colors.subText}`}>{day}</div>)}
        </div>
        {weeks.map((week, weekIndex) => {
          const first = calendarDay(week[0].date);
          const last = calendarDay(week[6].date);
          const entries = visibleEvents.filter(event => event.startDate && event.endDate && calendarDay(event.startDate) <= last && calendarDay(event.endDate) >= first);
          // Une ligne par plage évite tout recouvrement, même après déplacement.
          return (
            <div
              key={first}
              ref={element => { rows.current[weekIndex] = element; }}
              className={`relative border-b ${colors.border}`}
              style={{ minHeight: 110 }}
            >
              <div className="absolute inset-0 grid grid-cols-7 pointer-events-none">
                {week.map(cell => <div
                  key={cell.date.toISOString()}
                  className={`border-r ${colors.border} ${!cell.currentMonth ? colors.headerBg : ""} ${isSameDate(cell.date, new Date()) ? colors.todayBg : ""}`}
                />)}
              </div>
              <div className="relative grid grid-cols-7 h-8">
                {week.map(cell => <div
                  key={cell.date.toISOString()}
                  className={`px-2 py-1 text-xs ${!cell.currentMonth ? "opacity-40" : ""} ${isSameDate(cell.date, new Date()) ? `${colors.todayText} font-bold` : colors.subText}`}
                >{cell.date.getDate()}</div>)}
              </div>
              <div className="relative grid grid-cols-7 gap-y-1 pb-3">
                {entries.map((event, index) => {
                  const start = calendarDay(event.startDate!);
                  const end = calendarDay(event.endDate!);
                  return (
                    <div
                      key={event.id}
                      data-calendar-event={event.id}
                      role="button"
                      tabIndex={disabled ? -1 : 0}
                      aria-disabled={disabled}
                      aria-pressed={selectedEventId === event.id}
                      aria-label={`${event.title}, du ${formatDate(event.startDate)} au ${formatDate(event.endDate)}`}
                      title={`${event.title} · ${formatDate(event.startDate)} – ${formatDate(event.endDate)}`}
                      className={`relative mx-0.5 flex h-8 min-w-0 items-center rounded-md border border-primary/60 bg-primary/15 text-base-content shadow-sm touch-none ${disabled ? "opacity-60" : "cursor-grab active:cursor-grabbing"} ${selectedEventId === event.id ? "ring-2 ring-primary ring-offset-1 ring-offset-base-100" : "hover:bg-primary/25"}`}
                      style={{
                        gridColumn: `${Math.max(start - first, 0) + 1} / ${Math.min(end - first, 6) + 2}`,
                        gridRow: index + 1
                      }}
                      onPointerDown={e => begin(e, event)}
                      onClick={e => {
                        if (suppressClick.current) { suppressClick.current = false; return; }
                        if (!disabled && e.detail === 0) onClickDetails?.(event.id, e.currentTarget.getBoundingClientRect());
                      }}
                      onKeyDown={e => {
                        if (!disabled && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          onClickDetails?.(event.id, e.currentTarget.getBoundingClientRect());
                        }
                        if (e.key === "Escape") finish(true);
                      }}
                    >
                      {start >= first && onChangeDates && <span
                        data-resize="start"
                        title="Modifier la date de début"
                        className="absolute inset-y-0 left-0 z-10 w-2.5 cursor-ew-resize rounded-l-md border-l-4 border-transparent hover:border-primary hover:bg-primary/20"
                      />}
                      <span className="truncate px-3 text-xs font-medium">{event.title}</span>
                      {end <= last && onChangeDates && <span
                        data-resize="end"
                        title="Modifier la date de fin"
                        className="absolute inset-y-0 right-0 z-10 w-2.5 cursor-ew-resize rounded-r-md border-r-4 border-transparent hover:border-primary hover:bg-primary/20"
                      />}
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
}
