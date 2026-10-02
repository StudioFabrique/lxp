import * as Popover from "@radix-ui/react-popover";
import { Plus, X } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import Calendar from "../../../calendar/components/calendar";
import TimeSelector from "../../../calendar/components/time-selector";
import type Module from "../../../../utils/interfaces/module";
import { localCalendarDate, type ModuleCalendarStore } from "../../hooks/use-module-calendar";
import { formatTitle } from "../../../../utils/helpers/text-helpers";
import { calendarColor } from "../../../calendar/components/calendar-configuration";
import { cn } from "../../../../utils/cn";
import { ColorPicker } from "./color-picker";
import { DatesEditor } from "./dates-editor";

export default function ModuleCourseCalendar({
  module,
  store,
}: {
  module: Module;
  store: ModuleCalendarStore;
}) {
  const { selection, setSelection, currentDate, setCurrentDate } = store;
  const container = useRef<HTMLDivElement>(null);
  const anchorElement = useRef<HTMLElement | null>(null);
  const [anchorReady, setAnchorReady] = useState<string | null>(null);
  const virtualAnchor = useRef({
    getBoundingClientRect: () =>
      anchorElement.current?.getBoundingClientRect() ?? new DOMRect(),
    get contextElement() {
      return anchorElement.current ?? undefined;
    },
  });
  const selectedCourse = module.courses.find(
    (course) => course.id === selection?.courseId,
  );
  const selectedDates = selection
    ? store.datesByCourse.get(selection.courseId)
    : undefined;
  const selectedColor = selection
    ? calendarColor(
        store.events.find((event) => event.id === selection.eventId)?.color,
      )
    : "primary";
  const firstDate = store.events[0]?.startDate;
  const positioned = useRef(false);

  useLayoutEffect(() => {
    if (positioned.current || !firstDate) return;
    positioned.current = true;
    setCurrentDate(firstDate);
  }, [firstDate, setCurrentDate]);

  useLayoutEffect(() => {
    if (!selection) return;
    const elements = Array.from(
      container.current?.querySelectorAll<HTMLElement>(
        `[data-calendar-event="${selection.eventId}"]`,
      ) ?? [],
    );
    // Une plage peut occuper plusieurs semaines : ancrer le segment cliqué.
    const clickedRect = selection.rect;
    const element = clickedRect
      ? elements.reduce<HTMLElement | undefined>((closest, candidate) => {
          if (!closest) return candidate;
          const distance = (item: HTMLElement) => {
            const rect = item.getBoundingClientRect();
            return (
              Math.abs(rect.top - clickedRect.top) +
              Math.abs(rect.left - clickedRect.left)
            );
          };
          return distance(candidate) < distance(closest) ? candidate : closest;
        }, undefined)
      : elements[0];
    if (!element) return;
    if (!clickedRect) element.scrollIntoView({ block: "nearest" });
    anchorElement.current = element;
    setAnchorReady(selection.eventId);
  }, [selection, store.events, currentDate]);

  const changeDate = (date: Date) => {
    setSelection(null);
    setCurrentDate(date);
  };

  if (store.isPending)
    return (
      <div
        role="status"
        aria-label="Chargement du calendrier"
        className="space-y-4 p-5"
      >
        <span className="sr-only">Chargement du calendrier…</span>
        <div className="skeleton h-10 w-56" />
        <div className="skeleton h-[50vh] w-full rounded-box" />
      </div>
    );
  if (store.isError)
    return (
      <div role="alert" className="rounded-lg border border-error p-6">
        Impossible de charger le calendrier.{" "}
        <button className="btn btn-sm" onClick={() => void store.refetch()}>
          Réessayer
        </button>
      </div>
    );

  return (
    <div
      ref={container}
      className="min-w-0"
      aria-label="Planification des cours"
    >
      <Calendar
        events={[]}
        timelineEvents={store.events}
        currentDate={currentDate}
        view="planning"
        selectedTimelineEventId={selection?.eventId}
        planningDisabled={store.isSaving || store.isAdding}
        onChangeTimelineEventDates={(id, start, end) => {
          void store.changeDates(id, start, end);
        }}
        onClickTimelineYearEventDetails={(id, rect) => {
          store.setIsAdding(false);
          setAnchorReady(null);
          setSelection({
            courseId: Number(String(id).split(":")[0]),
            eventId: String(id),
            rect,
          });
        }}
        header={
          <div className="flex flex-col gap-3 border-b border-base-300 bg-base-200 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold first-letter:uppercase">
                {formatTitle(module.title)}
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                <TimeSelector
                  view="month"
                  date={currentDate}
                  setDate={changeDate}
                />
                {store.orphanIds.length > 0 && (
                  <button
                    className={cn(
                      "btn btn-sm",
                      store.isAdding ? "btn-outline" : "btn-primary",
                    )}
                    disabled={store.isSaving}
                    aria-pressed={store.isAdding}
                    onClick={() => {
                      setSelection(null);
                      store.setIsAdding(!store.isAdding);
                    }}
                  >
                    {store.isAdding ? (
                      <X className="size-4" />
                    ) : (
                      <Plus className="size-4" />
                    )}
                    {store.isAdding
                      ? "Annuler l’ajout"
                      : "Ajouter un cours au calendrier"}
                  </button>
                )}
              </div>
            </div>

            {store.events.length === 0 && (
              <p className="text-sm">
                Aucun cours planifié. Ajoutez un cours depuis la liste de
                gauche.
              </p>
            )}
          </div>
        }
      />
      <Popover.Root
        open={Boolean(
          selection &&
          selection.showDetails !== false &&
          selectedCourse &&
          anchorReady === selection.eventId,
        )}
        onOpenChange={(open) => {
          if (!open && !store.isSaving) {
            setSelection(null);
            setAnchorReady(null);
          }
        }}
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
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="mb-4 flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2">
                {selection && (
                  <ColorPicker
                    key={selection.courseId}
                    color={selectedColor}
                    disabled={store.isSaving}
                    onChange={(color) => {
                      void store.saveColor(selection.courseId, color);
                    }}
                  />
                )}
                <h3 className="font-semibold">
                  {formatTitle(selectedCourse?.title)}
                </h3>
              </div>
              <Popover.Close
                className="btn btn-xs btn-ghost"
                aria-label="Fermer les dates"
                disabled={store.isSaving}
              >
                <X className="size-4" />
              </Popover.Close>
            </div>
            {selection && selectedDates && (
              <DatesEditor
                key={`${selection.courseId}:${JSON.stringify(selectedDates)}`}
                dates={selectedDates}
                isSaving={store.isSaving}
                onSave={async (dates) => {
                  const saved = await store.saveDates(
                    selection.courseId,
                    dates,
                  );
                  if (saved) {
                    setSelection(null);
                    setCurrentDate(localCalendarDate(dates[0].minDate));
                  }
                  return saved;
                }}
                onDelete={() => {
                  void store.saveDates(selection.courseId, []).then((saved) => {
                    if (saved) setSelection(null);
                  });
                }}
              />
            )}
            <Popover.Arrow className="fill-base-100" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export { ColorPicker } from "./color-picker";
export { DatesEditor } from "./dates-editor";
