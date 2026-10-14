import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import EmptyStatePlaceholder from "../../../components/UI/empty-state-placeholder";
import ParcoursFilterBadges from "../../../components/UI/parcours-filter-badges";
import { AuthContext } from "../../../store/AuthProvider";
import apiClient from "../../../lib/axios";
import type { CalendarView } from "../components/calendar-configuration";
import { type ParcoursOption } from "./CalendarHome.types";
import { ParcoursCalendar } from "./ParcoursCalendar";

type ReadCalendarBrowserProps = {
  allowedViews?: CalendarView[];
  defaultView?: CalendarView;
};

export function ReadCalendarBrowser({
  allowedViews = ["day", "week", "month", "year-timeline"],
  defaultView = "week",
}: ReadCalendarBrowserProps = {}) {
  const { user } = useContext(AuthContext);
  const scopeKey = `${user?._id ?? "anonymous"}:${user?.roles[0]?.rank ?? ""}`;
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
        <LoadingSkeleton variant="rows" label="Chargement des parcours" />
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
            <EmptyStatePlaceholder title="Aucun parcours accessible." />
          )}
        </>
      )}
    </>
  );
}
