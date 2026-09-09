import { useContext, useMemo, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router";
import { ArrowRight, X } from "lucide-react";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import ParcoursFilterBadges from "../../../components/UI/parcours-filter-badges";
import { AuthContext } from "../../../store/AuthProvider";
import { ThemeContext } from "../../../store/ThemeProvider";
import apiClient from "../../../lib/axios";
import Calendar from "../components/calendar";
import type {
  CalendarEvent,
  CalendarView,
} from "../components/calendar-configuration";
import ViewSelector from "../components/view-selector";
import TimeSelector from "../components/time-selector";
import {
  calendarCourseEvents,
  localDate,
  minutes,
  type ReadCalendar,
} from "../components/read-calendar-utils";
import { formatDate } from "../components/calendar-utils";

type ParcoursOption = { id: number; title: string };

export default function CalendarHome() {
  return (
    <PageWrapper>
      <Header
        title="Calendrier"
        description="Consultez les cours et les modules d’un parcours."
      />
      <ReadCalendarBrowser />
    </PageWrapper>
  );
}

type ReadCalendarBrowserProps = {
  allowedViews?: CalendarView[];
  defaultView?: CalendarView;
};

export function ReadCalendarBrowser({
  allowedViews = ["day", "week", "month", "year-timeline"],
  defaultView = "week",
}: ReadCalendarBrowserProps = {}) {
  const { user } = useContext(AuthContext);
  const scopeKey = `${user?._id ?? "anonymous"}:${user?.roles.map(role => role.rank).sort().join(",") ?? ""}`;
  const [view, setView] = useState<CalendarView>(defaultView);
  const [date, setDate] = useState(new Date());
  const [parcoursId, setParcoursId] = useState<number | null>(null);
  const parcoursQuery = useQuery({
    queryKey: ["read-calendar", scopeKey, "parcours"],
    queryFn: async () =>
      (await apiClient.get<ParcoursOption[]>("/course/calendar/parcours")).data,
  });
  const parcours = parcoursQuery.data ?? [];
  const selected =
    parcours.find((item) => item.id === parcoursId) ?? parcours[0];
  return (
    <>
      {parcoursQuery.isPending ? (
        <p role="status">Chargement des parcours…</p>
      ) : parcoursQuery.isError ? (
        <p role="alert">
          Impossible de charger les parcours.{" "}
          <button
            className="btn btn-sm"
            onClick={() => void parcoursQuery.refetch()}
          >
            Réessayer
          </button>
        </p>
      ) : (
        <>
          {parcours.length > 1 && (
            <ParcoursFilterBadges
              parcours={parcours.map((item) => item.title)}
              selectedParcours={selected?.title ?? null}
              allowAll={false}
              onSelect={(title) => {
                const item = parcours.find((item) => item.title === title);
                if (item) setParcoursId(item.id);
              }}
            />
          )}
          {selected ? (
            <ParcoursCalendar
              key={selected.id}
              parcours={selected}
              scopeKey={scopeKey}
              allowedViews={allowedViews}
              view={view}
              setView={setView}
              date={date}
              setDate={setDate}
            />
          ) : (
            <p className="py-10 text-center">Aucun parcours accessible.</p>
          )}
        </>
      )}
    </>
  );
}

function ParcoursCalendar({
  parcours,
  scopeKey,
  allowedViews,
  view,
  setView,
  date,
  setDate,
}: {
  allowedViews: CalendarView[];
  parcours: ParcoursOption;
  scopeKey: string;
  view: CalendarView;
  setView: (view: CalendarView) => void;
  date: Date;
  setDate: (date: Date) => void;
}) {
  const { theme } = useContext(ThemeContext);
  const { pathname } = useLocation();
  const area = pathname.startsWith("/student/") ? "student" : "admin";
  const [selection, setSelection] = useState<{
    event: CalendarEvent;
    rect: DOMRect;
  } | null>(null);
  const anchor = useRef({ getBoundingClientRect: () => new DOMRect() });
  const query = useQuery({
    queryKey: ["read-calendar", scopeKey, parcours.id],
    queryFn: async () =>
      (
        await apiClient.get<ReadCalendar>(
          `/course/calendar/parcours/${parcours.id}`,
        )
      ).data,
  });
  const events = useMemo(
    () => calendarCourseEvents(query.data, date, view, area),
    [query.data, date, view, area],
  );
  const timeline = (query.data?.modules ?? []).map((module) => ({
    id: module.id,
    title: module.title,
    startDate: module.minDate ? localDate(module.minDate) : undefined,
    endDate: module.maxDate ? localDate(module.maxDate) : undefined,
  }));
  const timed = events.filter((event) => !event.allDay);
  const startHour = Math.min(
    8,
    ...timed.map((event) => Math.floor(minutes(event.start) / 60)),
  );
  const endHour = Math.max(
    19,
    ...timed.map((event) => Math.ceil(minutes(event.end) / 60)),
  );
  const select = (event: CalendarEvent | undefined, rect: DOMRect) => {
    if (!event) return;
    anchor.current.getBoundingClientRect = () => rect;
    setSelection({ event, rect });
  };
  const changeDate = (value: Date) => {
    setSelection(null);
    setDate(value);
  };
  return (
    <div className="mt-4 space-y-3">
      {query.isPending ? (
        <p role="status">Chargement du calendrier…</p>
      ) : query.isError ? (
        <p role="alert">
          Impossible de charger le calendrier.{" "}
          <button className="btn btn-sm" onClick={() => void query.refetch()}>
            Réessayer
          </button>
        </p>
      ) : (
        <>
          <Calendar
            onSelectDay={value => { changeDate(value); setView("day"); }}
            events={events}
            timelineEvents={timeline}
            view={view}
            currentDate={date}
            startHour={startHour}
            endHour={endHour}
            darkMode={theme === "dark"}
            onClickEventDetails={(id, rect) =>
              select(
                events.find((event) => event.id === id),
                rect,
              )
            }
            onClickTimelineYearEventDetails={(id, rect) => {
              const module = query.data?.modules.find(
                (module) => module.id === id,
              );
              if (module)
                select(
                  {
                    id: module.id,
                    title: module.title,
                    subtitle: "Module",
                    description: module.description ?? undefined,
                    start: "",
                    end: "",
                    type: "primary",
                    rangeStart: module.minDate ?? undefined,
                    rangeEnd: module.maxDate ?? undefined,
                    to: `/${area}/parcours/module/${module.id}`,
                  },
                  rect,
                );
            }}
            header={
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-300 bg-base-200 p-4">
                <h2 className="font-semibold">{parcours.title}</h2>
                <div className="flex flex-wrap items-center gap-2">
                  {view !== "year-timeline" && (
                    <TimeSelector
                      view={view}
                      date={date}
                      setDate={changeDate}
                    />
                  )}
                  <ViewSelector
                    view={view}
                    setView={(value) => {
                      setSelection(null);
                      setView(value);
                    }}
                    allowedViews={allowedViews}
                    darkMode={theme === "dark"}
                  />
                </div>
              </div>
            }
          />
        </>
      )}
      <Popover.Root
        open={Boolean(selection)}
        onOpenChange={(open) => {
          if (!open) setSelection(null);
        }}
      >
        <Popover.Anchor virtualRef={anchor} />
        <Popover.Portal>
          <Popover.Content
            side="top"
            align="start"
            sideOffset={8}
            collisionPadding={16}
            className="z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-base-300 bg-base-100 p-4 shadow-xl"
            aria-label="Détails du calendrier"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{selection?.event.title}</h3>
              <Popover.Close
                className="btn btn-xs btn-ghost"
                aria-label="Fermer les détails"
              >
                <X className="size-4" />
              </Popover.Close>
            </div>
            <p className="mt-1 text-sm text-base-content/60">
              {selection?.event.subtitle}
            </p>
            {selection?.event.description && (
              <p className="mt-3 max-h-40 overflow-auto whitespace-pre-line text-sm">
                {selection.event.description}
              </p>
            )}
            <p className="mt-3 text-sm">
              {formatDate(selection?.event.rangeStart)}
              {selection?.event.rangeEnd &&
                ` – ${formatDate(selection.event.rangeEnd)}`}
            </p>
            {selection?.event.date && (
              <p className="mt-1 text-sm">
                {selection.event.allDay
                  ? "Sans horaire"
                  : `${selection.event.start} – ${selection.event.end}, chaque jour`}
              </p>
            )}
            {selection?.event.to && (
              <Link
                to={selection.event.to}
                state={selection.event.navigationState}
                className="btn btn-primary btn-sm mt-4 w-full"
              >
                {selection.event.subtitle === "Module" && !selection.event.date
                  ? "Accéder au module"
                  : "Accéder au cours"}
                <ArrowRight className="size-4" />
              </Link>
            )}
            <Popover.Arrow className="fill-base-100" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
