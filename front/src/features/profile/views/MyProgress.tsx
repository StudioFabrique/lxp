import { formatTitle } from "../../../utils/helpers/text-helpers";
import { useQuery } from "@tanstack/react-query";
import { ChartNoAxesCombined } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router";
import { useState } from "react";
import StudentProfile from "./StudentProfile";
import Header from "../../../components/headers/Header";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import Loader from "../../../components/loaders/Loader";
import PermissionGuard from "../../../components/guards/PermissionGuard";
import { parcoursApi } from "../../parcours/api/parcours.api";
import type Parcours from "../../../utils/interfaces/parcours";
import Journal from "../components/journal/journal";
import Awards from "../components/awards/awards";

async function loadParcoursProgress(): Promise<Parcours[]> {
  const parcours = await parcoursApi.queries.getAll(true);
  return Promise.all(
    parcours.map((item) => parcoursApi.queries.getById(item.id)),
  );
}

export default function MyProgress() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const space = pathname.split("/")[1];
  const {
    data: parcours = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-progress", "modules"],
    queryFn: loadParcoursProgress,
  });
  const requestedParcoursId = Number(searchParams.get("parcoursId"));
  const selectedParcours =
    parcours.find((item) => item.id === requestedParcoursId) ?? parcours[0];

  return (
    <PageWrapper className="gap-8">
      <Header
        title="Mon avancement"
        description="Suivez la progression de vos modules, vos accomplissements et vos badges de compétences."
        icon={ChartNoAxesCombined}
      ><button type="button" className="btn btn-outline" onClick={() => setSettingsOpen(true)}>Mes préférences et niveaux</button></Header>
      {settingsOpen && <StudentProfile onClose={() => setSettingsOpen(false)} />}
      {parcours.length > 1 && (
        <div className="flex flex-col gap-2 sm:max-w-md">
          <label htmlFor="progress-parcours" className="font-semibold">
            Parcours
          </label>
          <select
            id="progress-parcours"
            className="select select-bordered w-full"
            value={selectedParcours?.id ?? ""}
            onChange={(event) =>
              setSearchParams((previous) => {
                const next = new URLSearchParams(previous);
                next.set("parcoursId", event.target.value);
                return next;
              })
            }
          >
            {parcours.map((item) => (
              <option key={item.id} value={item.id}>
                {formatTitle(item.title)}
              </option>
            ))}
          </select>
        </div>
      )}
      <section aria-labelledby="module-progress-title" className="space-y-4">
        <h2 id="module-progress-title" className="text-xl font-bold">
          Progression des modules
        </h2>
        {isLoading ? (
          <Loader />
        ) : isError ? (
          <p role="alert" className="alert alert-error">
            Impossible de charger les progressions.
          </p>
        ) : parcours.length === 0 ? (
          <p className="rounded-lg bg-base-200 p-4">
            Aucun parcours disponible.
          </p>
        ) : (
          <div className="rounded-xl border border-base-300 bg-base-200 p-5">
            <h3 className="mb-4 font-semibold">{formatTitle(selectedParcours.title)}</h3>
            {selectedParcours.modules?.length ? (
              <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {selectedParcours.modules.map((module) => {
                  const progress = Math.min(
                    100,
                    Math.max(0, module.stats?.progress ?? 0),
                  );
                  return (
                    <li
                      key={module.id}
                      className="rounded-lg bg-base-100 p-4"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <Link
                          to={`/${space}/parcours/module/${module.id}`}
                          className="font-medium hover:underline first-letter:uppercase"
                        >
                          {formatTitle(module.title)}
                        </Link>
                        <span className="font-semibold text-primary">
                          {progress}%
                        </span>
                      </div>
                      <progress
                        className="progress progress-primary w-full"
                        value={progress}
                        max={100}
                        aria-label={`Progression du module ${formatTitle(module.title)}`}
                      />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-base-content/60">
                Aucun module disponible.
              </p>
            )}
          </div>
        )}
      </section>
      <PermissionGuard object="parcours" action="read">
        <section aria-label="Journal">
          <Journal parcoursId={selectedParcours?.id} />
        </section>
      </PermissionGuard>
      <PermissionGuard object="bonusSkill" action="read">
        <section aria-label="Badges et compétences">
          <Awards parcours={selectedParcours} />
        </section>
      </PermissionGuard>
    </PageWrapper>
  );
}
