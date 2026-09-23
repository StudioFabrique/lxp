import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Calendar from "../../../calendar/components/calendar";
import type Module from "../../../../utils/interfaces/module";
import type CourseDates from "../../../course/interfaces/course-dates";
import { dateInputValue, localCalendarDate, type ModuleCalendarStore } from "../../hooks/use-module-calendar";
import DatePicker from "../../../../components/UI/date-picker/date-picker";

import CourseTimeFields from "../../../course/components/edit/calendar/course-time-fields";
import { validCourseTimes } from "../../../course/helpers/course-times";
import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { calendarColor, calendarColors, colorDots, type CalendarColor } from "../../../calendar/components/calendar-configuration";
import { cn } from "../../../../utils/cn";

export function ColorPicker({ color, disabled, onChange }: { color: CalendarColor; disabled: boolean; onChange: (color: CalendarColor) => void }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  return <div className="relative mt-1 size-4 shrink-0">
    <div className="absolute left-0 top-0 z-10 flex items-center gap-1.5">
      <AnimatePresence>
        {open && <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-1 rounded-full bg-base-100/20 backdrop-blur-[2px]"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.16 }}
        />}
      </AnimatePresence>
      <button type="button" disabled={disabled} aria-label="Changer la couleur du cours" aria-expanded={open}
        className={cn("relative z-10 size-4 shrink-0 cursor-pointer rounded-full border border-base-content/20 ring-offset-2 ring-offset-base-100 hover:border-base-content/70 hover:ring-2 hover:ring-base-content/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed", colorDots[color])}
        onClick={() => setOpen(value => !value)} />
      <AnimatePresence>
        {open && calendarColors.filter(option => option !== color).map((option, index) => <motion.button
          key={option} type="button" disabled={disabled} aria-label={`Choisir la couleur ${option}`}
          className={cn("relative z-10 size-4 shrink-0 cursor-pointer rounded-full border border-base-content/20 hover:border-base-content/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed", colorDots[option])}
          initial={reducedMotion ? false : { opacity: 0, scale: 0.3, x: -8 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 0.3, x: -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.16, delay: reducedMotion ? 0 : index * 0.035 }}
          onClick={() => { setOpen(false); onChange(option); }}
        />)}
      </AnimatePresence>
    </div>
  </div>;
}

export function DatesEditor({ dates, isSaving, onSave, onDelete }: {
  dates: CourseDates[];
  isSaving: boolean;
  onSave: (dates: CourseDates[]) => Promise<boolean>;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(() => dates.map(date => ({ ...date })));
  const validDates = draft.every(date => date.minDate && date.maxDate && dateInputValue(date.minDate) <= dateInputValue(date.maxDate));
  const valid = validDates && draft.every(date => validCourseTimes(date.startTime, date.endTime));
  return <form
    className="flex flex-col gap-4"
    onSubmit={async e => { e.preventDefault(); if (valid) await onSave(draft); }}
  >
    <div className="max-h-[50vh] space-y-4 overflow-y-auto">
      {draft.map((date, index) => <fieldset key={index} disabled={isSaving} className="flex flex-col gap-3">
        {draft.length > 1 && <legend className="mb-2 text-sm font-medium">Plage {index + 1}</legend>}
        <div className="flex flex-col gap-4 divide-y divide-base-300">
          <div className="@container min-w-0 space-y-2 pb-4">
            <p className="text-sm font-medium">Dates</p>
            <div className="grid grid-cols-1 gap-3 @min-[19rem]:grid-cols-2">
              <DatePicker label="Date de début" display="short" className="min-w-0" value={dateInputValue(date.minDate)} max={dateInputValue(date.maxDate)} clearable={false}
                onChange={value => setDraft(previous => previous.map((item, i) => i === index ? { ...item, minDate: `${value}T00:00:00.000Z` } : item))} />
              <DatePicker label="Date de fin" display="short" className="min-w-0" value={dateInputValue(date.maxDate)} min={dateInputValue(date.minDate)} clearable={false}
                onChange={value => setDraft(previous => previous.map((item, i) => i === index ? { ...item, maxDate: `${value}T00:00:00.000Z` } : item))} />
            </div>
          </div>
          <div className="min-w-0">
            <CourseTimeFields startTime={date.startTime} endTime={date.endTime}
              onChange={times => setDraft(previous => previous.map((item, i) => i === index ? { ...item, ...times } : item))} />
          </div>
        </div>
      </fieldset>)}
    </div>
    {!validDates && <p role="alert" className="text-sm text-error">Vérifiez les dates de chaque plage.</p>}
    <button type="submit" className="btn btn-primary" disabled={isSaving || !valid}>{isSaving ? "Enregistrement…" : "Enregistrer"}</button>
    <button
      type="button"
      className="btn btn-ghost text-error border-t border-base-300"
      disabled={isSaving}
      onClick={onDelete}
    ><Trash2 className="size-4" /> Supprimer les dates du cours</button>
  </form>;
}

export default function ModuleCourseCalendar({ module, store }: { module: Module; store: ModuleCalendarStore; }) {
  const { selection, setSelection, currentDate, setCurrentDate } = store;
  const container = useRef<HTMLDivElement>(null);
  const anchorElement = useRef<HTMLElement | null>(null);
  const [anchorReady, setAnchorReady] = useState<string | null>(null);
  const virtualAnchor = useRef({
    getBoundingClientRect: () => anchorElement.current?.getBoundingClientRect() ?? new DOMRect(),
    get contextElement() { return anchorElement.current ?? undefined; },
  });
  const selectedCourse = module.courses.find(course => course.id === selection?.courseId);
  const selectedDates = selection ? store.datesByCourse.get(selection.courseId) : undefined;
  const selectedColor = selection ? calendarColor(store.events.find(event => event.id === selection.eventId)?.color) : "primary";
  const firstDate = store.events[0]?.startDate;
  const positioned = useRef(false);

  useLayoutEffect(() => {
    if (positioned.current || !firstDate) return;
    positioned.current = true;
    setCurrentDate(firstDate);
  }, [firstDate, setCurrentDate]);

  useLayoutEffect(() => {
    if (!selection) return;
    const elements = Array.from(container.current?.querySelectorAll<HTMLElement>(
      `[data-calendar-event="${selection.eventId}"]`,
    ) ?? []);
    // Une plage peut occuper plusieurs semaines : ancrer le segment cliqué.
    const clickedRect = selection.rect;
    const element = clickedRect
      ? elements.reduce<HTMLElement | undefined>((closest, candidate) => {
          if (!closest) return candidate;
          const distance = (item: HTMLElement) => {
            const rect = item.getBoundingClientRect();
            return Math.abs(rect.top - clickedRect.top) + Math.abs(rect.left - clickedRect.left);
          };
          return distance(candidate) < distance(closest) ? candidate : closest;
        }, undefined)
      : elements[0];
    if (!element) return;
    if (!clickedRect) element.scrollIntoView({ block: "nearest" });
    anchorElement.current = element;
    setAnchorReady(selection.eventId);
  }, [selection, store.events, currentDate]);

  const navigateMonth = (delta: number) => {
    setSelection(null);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  if (store.isPending) return <div role="status" aria-label="Chargement du calendrier" className="space-y-4 p-5"><span className="sr-only">Chargement du calendrier…</span><div className="skeleton h-10 w-56" /><div className="skeleton h-[50vh] w-full rounded-box" /></div>;
  if (store.isError) return <div role="alert" className="rounded-lg border border-error p-6">Impossible de charger le calendrier. <button className="btn btn-sm" onClick={() => void store.refetch()}>Réessayer</button></div>;

  return <div ref={container} className="min-w-0" aria-label="Planification des cours">
    <Calendar events={[]} timelineEvents={store.events} currentDate={currentDate} view="planning"
      selectedTimelineEventId={selection?.eventId} planningDisabled={store.isSaving || store.isAdding}
      onChangeTimelineEventDates={(id, start, end) => { void store.changeDates(id, start, end); }}
      onClickTimelineYearEventDetails={(id, rect) => {
        store.setIsAdding(false);
        setAnchorReady(null);
        setSelection({ courseId: Number(String(id).split(":")[0]), eventId: String(id), rect });
      }}
      header={<div className="flex flex-col gap-3 border-b border-base-300 bg-base-200 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <button
              className="btn btn-sm btn-ghost"
              aria-label="Mois précédent"
              onClick={() => navigateMonth(-1)}
            ><ChevronLeft className="size-4" /></button>
            <h2 className="min-w-36 text-center font-semibold capitalize">{currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</h2>
            <button
              className="btn btn-sm btn-ghost"
              aria-label="Mois suivant"
              onClick={() => navigateMonth(1)}
            ><ChevronRight className="size-4" /></button>
          </div>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => { setSelection(null); setCurrentDate(new Date()); }}
          >Aujourd’hui</button>
          {store.orphanIds.length > 0 && <button className={cn("btn btn-sm", store.isAdding ? "btn-outline" : "btn-primary")} disabled={store.isSaving} aria-pressed={store.isAdding}
            onClick={() => { setSelection(null); store.setIsAdding(!store.isAdding); }}>
            {store.isAdding ? <X className="size-4" /> : <Plus className="size-4" />}
            {store.isAdding ? "Annuler l’ajout" : "Ajouter un cours au calendrier"}
          </button>}
        </div>
        <p role="status" className="text-xs text-base-content/70">{store.isSaving ? "Enregistrement des dates…" : store.isAdding ? "Sélectionnez un cours disponible dans la liste de gauche." : "Déplacez un cours ou étirez ses bords pour ajuster ses dates. Cliquez dessus pour les modifier."}</p>
        {store.events.length === 0 && <p className="text-sm">Aucun cours planifié. Ajoutez un cours depuis la liste de gauche.</p>}
      </div>}
    />
    <Popover.Root
      open={Boolean(selection && selection.showDetails !== false && selectedCourse && anchorReady === selection.eventId)}
      onOpenChange={open => { if (!open && !store.isSaving) { setSelection(null); setAnchorReady(null); } }}
    >
      <Popover.Anchor virtualRef={virtualAnchor} />
      <Popover.Portal>
        <Popover.Content
          side="top"
          updatePositionStrategy="always"
          hideWhenDetached
          avoidCollisions
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 data-[detached]:invisible w-96 max-w-[calc(100vw-2rem)] rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl"
          aria-label={`Dates du cours ${formatTitle(selectedCourse?.title)}`}
          onCloseAutoFocus={e => e.preventDefault()}
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <div className="flex min-w-0 items-start gap-2">
              {selection && <ColorPicker key={selection.courseId} color={selectedColor} disabled={store.isSaving}
                onChange={color => { void store.saveColor(selection.courseId, color); }} />}
              <h3 className="font-semibold">{formatTitle(selectedCourse?.title)}</h3>
            </div>
            <Popover.Close
              className="btn btn-xs btn-ghost"
              aria-label="Fermer les dates"
              disabled={store.isSaving}
            ><X className="size-4" /></Popover.Close>
          </div>
          {selection && selectedDates && <DatesEditor key={`${selection.courseId}:${JSON.stringify(selectedDates)}`} dates={selectedDates} isSaving={store.isSaving}
            onSave={async dates => {
              const saved = await store.saveDates(selection.courseId, dates);
              if (saved) { setSelection(null); setCurrentDate(localCalendarDate(dates[0].minDate)); }
              return saved;
            }}
            onDelete={() => { void store.saveDates(selection.courseId, []).then(saved => { if (saved) setSelection(null); }); }} />}
          <Popover.Arrow className="fill-base-100" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  </div>;
}
