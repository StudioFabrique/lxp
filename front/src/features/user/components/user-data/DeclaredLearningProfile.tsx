import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import type { LearningContext } from "../../../learning-profile/types";
import { formatTitle } from "../../../../utils/helpers/text-helpers";
import {
  levelOptions,
  paceOptions,
  preferenceOptions,
} from "../../../learning-profile/learning-choice-options";

type DeclaredProfile = {
  profile: LearningContext["profile"];
  formations: LearningContext["availableFormations"];
} | null | undefined;

const labelFor = <T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T | null | undefined,
) => options.find((option) => option.value === value)?.label ?? "Non renseigné";

export default function DeclaredLearningProfile({ data }: { data: DeclaredProfile }) {
  return (
    <BoxWrapper>
      <section className="space-y-5" aria-labelledby="declared-profile-title">
        <div>
          <h2 id="declared-profile-title" className="text-xl font-bold">
            Profil d’apprentissage déclaré
          </h2>
          <p className="text-sm text-base-content/60">
            Informations déclarées par l’apprenant, distinctes des indicateurs mesurés.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-base-300 p-4">
            <h3 className="text-sm font-bold">Rythme préféré</h3>
            <p className="mt-2">{labelFor(paceOptions, data?.profile.pace)}</p>
          </div>
          <div className="rounded-xl border border-base-300 p-4">
            <h3 className="text-sm font-bold">Préférences</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {data?.profile.preferences.length ? data.profile.preferences.map((preference) => (
                <span key={preference} className="badge badge-outline">
                  {labelFor(preferenceOptions, preference)}
                </span>
              )) : <span>Non renseigné</span>}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold">Niveaux par module</h3>
          {data?.formations.length ? data.formations.flatMap((formation) => formation.parcours.flatMap((parcours) => parcours.modules.map((module) => ({ module, parcours, formation })))).map(({ module, parcours, formation }) => (
            <div key={module.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-base-200 p-3">
              <div>
                <p className="font-semibold">{formatTitle(module.title)}</p>
                <p className="text-xs text-base-content/60">{formatTitle(formation.title)} · {formatTitle(parcours.title)}</p>
              </div>
              <div className="text-right">
                <p>{labelFor(levelOptions, module.assessment?.level)}</p>
                <p className="text-xs text-base-content/60">
                  {module.assessment?.updatedAt
                    ? `Mis à jour le ${new Date(module.assessment.updatedAt).toLocaleDateString("fr-FR")}`
                    : "Non renseigné"}
                </p>
              </div>
            </div>
          )) : <p>Non renseigné</p>}
        </div>
      </section>
    </BoxWrapper>
  );
}
