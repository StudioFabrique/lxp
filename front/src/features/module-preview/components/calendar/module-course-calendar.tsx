import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, Plus, Trash2, X } from "lucide-react";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import { ThemeContext } from "../../../../store/ThemeProvider";
import Calendar from "../../../calendar/components/calendar";
import type Module from "../../../../utils/interfaces/module";
import type CourseDates from "../../../course/interfaces/course-dates";
import { dateInputValue, localCalendarDate, type ModuleCalendarStore } from "../../hooks/use-module-calendar";
import DatePicker from "../../../../components/UI/date-picker/date-picker";

function DatesEditor({ dates, isSaving, onSave, onDelete }: {
  dates: CourseDates[];
  isSaving: boolean;
  onSave: (dates: CourseDates[]) => Promise<boolean>;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(() => dates.map(date => ({ ...date })));
  const valid = draft.every(date => date.minDate && date.maxDate && dateInputValue(date.minDate) <= dateInputValue(date.maxDate));
  return <form
    className="flex flex-col gap-4"
    onSubmit={async e => { e.preventDefault(); if (valid) await onSave(draft); }}
  >
    <div className="max-h-[50vh] space-y-4 overflow-y-auto">
      {draft.map((date, index) => <fieldset key={index} disabled={isSaving} className="flex flex-col gap-3">
        {draft.length > 1 && <legend className="mb-2 text-sm font-medium">Plage {index + 1}</legend>}
        <DatePicker label="Date de début" value={dateInputValue(date.minDate)} max={dateInputValue(date.maxDate)} clearable={false}
          onChange={value => setDraft(previous => previous.map((item, i) => i === index ? { ...item, minDate: `${value}T00:00:00.000Z` } : item))} />
        <DatePicker label="Date de fin" value={dateInputValue(date.maxDate)} min={dateInputValue(date.minDate)} clearable={false}
          onChange={value => setDraft(previous => previous.map((item, i) => i === index ? { ...item, maxDate: `${value}T00:00:00.000Z` } : item))} />
      </fieldset>)}
    </div>
    {!valid && <p role="alert" className="text-sm text-error">La fin doit être postérieure ou égale au début.</p>}
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
  const { theme } = useContext(ThemeContext);
  const { selection, setSelection, currentDate, setCurrentDate } = store;
  const container = useRef<HTMLDivElement>(null);
  const anchorRect = useRef<DOMRect>(new DOMRect());
  const [anchorReady, setAnchorReady] = useState<string | null>(null);
  const virtualAnchor = useRef({ getBoundingClientRect: () => anchorRect.current });
  const selectedCourse = module.courses.find(course => course.id === selection?.courseId);
  const selectedDates = selection ? store.datesByCourse.get(selection.courseId) : undefined;
  const firstDate = store.events[0]?.startDate;
  const positioned = useRef(false);

  useLayoutEffect(() => {
    if (positioned.current || !firstDate) return;
    positioned.current = true;
    setCurrentDate(firstDate);
  }, [firstDate, setCurrentDate]);

  useLayoutEffect(() => {
    if (!selection) return;
    const element = container.current?.querySelector<HTMLElement>(`[data-calendar-event="${selection.eventId}"]`);
    const rect = selection.rect ?? element?.getBoundingClientRect();
    if (!rect) return;
    if (!selection.rect) element?.scrollIntoView({ block: "nearest" });
    anchorRect.current = selection.rect ?? element?.getBoundingClientRect() ?? rect;
    setAnchorReady(selection.eventId);
  }, [selection, store.events]);

  const navigateMonth = (delta: number) => {
    setSelection(null);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  if (store.isPending) return <div role="status" className="p-10 text-center">Chargement du calendrier…</div>;
  if (store.isError) return <div role="alert" className="rounded-lg border border-error p-6">Impossible de charger le calendrier. <button className="btn btn-sm" onClick={() => void store.refetch()}>Réessayer</button></div>;

  return <div ref={container} className="min-w-0" aria-label="Planification des cours">
    <Calendar darkMode={theme === "dark"} events={[]} timelineEvents={store.events} currentDate={currentDate} view="planning"
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
          {store.orphanIds.length > 0 && <button className={`btn btn-sm ${store.isAdding ? "btn-outline" : "btn-primary"}`} disabled={store.isSaving} aria-pressed={store.isAdding}
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
      open={Boolean(selection && selectedCourse && anchorReady === selection.eventId)}
      onOpenChange={open => { if (!open && !store.isSaving) { setSelection(null); setAnchorReady(null); } }}
    >
      <Popover.Anchor virtualRef={virtualAnchor} />
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl"
          aria-label={`Dates du cours ${selectedCourse?.title}`}
          onCloseAutoFocus={e => e.preventDefault()}
        >
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="font-semibold">{selectedCourse?.title}</h3>
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
