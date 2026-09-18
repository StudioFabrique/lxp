import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useBlocker, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import Header from "../../../components/headers/Header";
import Loader from "../../../components/loaders/Loader";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import {
  levelOptions,
  paceOptions,
  PreferenceCards,
  SingleChoiceCards,
} from "../../learning-profile/LearningChoiceCards";
import {
  learningProfileApi,
  learningProfileKey,
} from "../../learning-profile/learning-profile.api";
import type {
  FormationLevel,
  LearningPace,
  LearningPreference,
} from "../../learning-profile/types";
import InformationAndSettings from "../components/information/information-and-settings";

const tabs = [
  { id: "informations", label: "Informations personnelles" },
  { id: "preferences", label: "Préférences d’apprentissage" },
  { id: "niveaux", label: "Niveaux par formation" },
] as const;
type TabId = (typeof tabs)[number]["id"];

export default function StudentProfile() {
  const [params, setParams] = useSearchParams();
  const requestedTab = params.get("onglet") as TabId | null;
  const activeTab = tabs.some((tab) => tab.id === requestedTab)
    ? requestedTab!
    : "informations";
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: learningProfileKey, queryFn: learningProfileApi.get });
  const informationForm = useRef<HTMLFormElement>(null);
  const [dirty, setDirty] = useState(false);
  const [pace, setPace] = useState<LearningPace | null>(null);
  const [preferences, setPreferences] = useState<LearningPreference[]>([]);
  const [levels, setLevels] = useState<Record<number, FormationLevel>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!query.data) return;
    setPace(query.data.profile.pace);
    setPreferences(query.data.profile.preferences);
    setLevels(
      Object.fromEntries(
        query.data.availableFormations
          .filter((formation) => formation.assessment)
          .map((formation) => [formation.id, formation.assessment!.level]),
      ),
    );
  }, [query.data]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const blocker = useBlocker(dirty);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm("Vous avez des modifications non enregistrées. Quitter cette page ?")) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker]);

  const switchTab = (tab: TabId) => {
    if (
      dirty &&
      !window.confirm("Vous avez des modifications non enregistrées. Changer d’onglet ?")
    ) return;
    setDirty(false);
    setParams({ onglet: tab });
  };

  const preferencesDirty = useMemo(() => {
    if (!query.data) return false;
    return (
      pace !== query.data.profile.pace ||
      [...preferences].sort().join("|") !==
        [...query.data.profile.preferences].sort().join("|")
    );
  }, [pace, preferences, query.data]);

  useEffect(() => {
    if (activeTab === "preferences") setDirty(preferencesDirty);
  }, [activeTab, preferencesDirty]);

  const savePreferences = async () => {
    if (!pace || preferences.length === 0) {
      toast.error("Choisissez un rythme et au moins une préférence.");
      return;
    }
    setSaving(true);
    try {
      await learningProfileApi.update({ pace, preferences });
      await queryClient.invalidateQueries({ queryKey: learningProfileKey });
      setDirty(false);
      toast.success("Préférences enregistrées.");
    } catch {
      toast.error("Impossible d’enregistrer les préférences.");
    } finally {
      setSaving(false);
    }
  };

  const saveLevels = async () => {
    if (!query.data) return;
    setSaving(true);
    try {
      const changed = query.data.availableFormations.filter(
        (formation) =>
          levels[formation.id] &&
          levels[formation.id] !== formation.assessment?.level,
      );
      await Promise.all(
        changed.map((formation) =>
          learningProfileApi.updateFormation(formation.id, levels[formation.id]!),
        ),
      );
      await queryClient.invalidateQueries({ queryKey: learningProfileKey });
      setDirty(false);
      toast.success("Niveaux enregistrés.");
    } catch {
      toast.error("Impossible d’enregistrer les niveaux.");
    } finally {
      setSaving(false);
    }
  };

  if (query.isLoading) return <Loader />;

  return (
    <PageWrapper as="main">
      <Header title="Mon profil" description="Gérez vos informations et vos préférences d’apprentissage." />
      <div
        className="tabs tabs-bordered flex-nowrap overflow-x-auto"
        role="tablist"
        aria-label="Sections du profil"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab shrink-0 ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => switchTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <BoxWrapper className="gap-6 p-5 sm:p-7">
        {activeTab === "informations" ? (
          <>
            <InformationAndSettings
              formRef={informationForm}
              onDirtyChange={setDirty}
              onSaved={() => setDirty(false)}
            />
            <div className="flex justify-end border-t border-base-300 pt-4">
              <button className="btn btn-primary" onClick={() => informationForm.current?.requestSubmit()}>
                Enregistrer
              </button>
            </div>
          </>
        ) : null}

        {activeTab === "preferences" ? (
          <>
            <div>
              <h2 className="text-xl font-bold">Préférences d’apprentissage</h2>
              <p className="text-sm text-base-content/70">
                Ces choix personnalisent votre accompagnement par l’IA.
              </p>
            </div>
            <SingleChoiceCards name="profile-pace" options={paceOptions} value={pace} onChange={setPace} />
            <PreferenceCards value={preferences} onChange={setPreferences} />
            <div className="flex justify-end border-t border-base-300 pt-4">
              <button className="btn btn-primary" disabled={saving} onClick={() => void savePreferences()}>
                Enregistrer
              </button>
            </div>
          </>
        ) : null}

        {activeTab === "niveaux" ? (
          <>
            <div>
              <h2 className="text-xl font-bold">Niveaux par formation</h2>
              <p className="text-sm text-base-content/70">Ces niveaux sont déclaratifs et modifiables à tout moment.</p>
            </div>
            {query.data?.availableFormations.length ? (
              query.data.availableFormations.map((formation) => (
                <section key={formation.id} className="rounded-xl border border-base-300 p-4 sm:p-5">
                  <h3 className="text-lg font-bold">{formation.title}</h3>
                  <p className="mb-4 text-sm text-base-content/65">
                    {formation.parcours.map((item) => item.title).join(" · ")}
                    {formation.assessment?.updatedAt
                      ? ` · Mis à jour le ${new Date(formation.assessment.updatedAt).toLocaleDateString("fr-FR")}`
                      : " · Non renseigné"}
                  </p>
                  <SingleChoiceCards
                    name={`profile-level-${formation.id}`}
                    options={levelOptions}
                    value={levels[formation.id] ?? null}
                    onChange={(level) => {
                      setLevels((current) => ({ ...current, [formation.id]: level }));
                      setDirty(true);
                    }}
                  />
                </section>
              ))
            ) : (
              <p className="py-12 text-center text-base-content/65">Aucune formation n’est disponible pour le moment.</p>
            )}
            <div className="flex justify-end border-t border-base-300 pt-4">
              <button className="btn btn-primary" disabled={saving} onClick={() => void saveLevels()}>
                Enregistrer
              </button>
            </div>
          </>
        ) : null}
      </BoxWrapper>
    </PageWrapper>
  );
}

