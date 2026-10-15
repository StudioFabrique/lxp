import { useId } from "react";
import { Users } from "lucide-react";
import RoleRadioCard from "../RoleRadioCard";
import CollapsibleSection from "../../../parcours/components/display/collapsible-section";
import BoxWrapper from "../../../../components/wrappers/BoxWrapper";
import {
  DEFAULT_ROLE_LABELS,
  ROLE_LABEL_FIELDS,
  type RoleLabelFieldName,
  type RoleLabelsFormValues,
} from "../../helpers/role-labels";

type RoleLabelsPreviewProps = {
  values: RoleLabelsFormValues;
};

const FIELD_NAMES = Object.keys(ROLE_LABEL_FIELDS) as RoleLabelFieldName[];
const noop = () => undefined;

/**
 * Aperçu en direct des libellés saisis, rendu avec les composants de
 * l'application : le sélecteur de modèle de rôle et le panneau d'équipe d'un
 * parcours. Un champ vide ou en cours de saisie affiche sa valeur par défaut.
 */
const RoleLabelsPreview = ({ values }: RoleLabelsPreviewProps) => {
  const radioGroupName = useId();
  const labelFor = (name: RoleLabelFieldName) =>
    values[name].trim() || DEFAULT_ROLE_LABELS[ROLE_LABEL_FIELDS[name]];

  return (
    <section className="flex flex-col gap-3 border-t border-base-300 pt-5">
      <header>
        <h2 className="text-sm font-semibold text-base-content">
          Aperçu dans l’application
        </h2>
        <p className="text-xs text-base-content/60">
          Voici comment ces noms apparaîtront, par exemple dans le choix du
          rôle d’un utilisateur et dans l’équipe d’un parcours.
        </p>
      </header>
      {/* Illustration seule : les cartes ne sont ni focalisables ni lues par les lecteurs d'écran. */}
      <div className="flex flex-col gap-3" inert aria-hidden="true">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FIELD_NAMES.map((name, index) => (
            <RoleRadioCard
              key={name}
              name={radioGroupName}
              value={ROLE_LABEL_FIELDS[name]}
              rank={ROLE_LABEL_FIELDS[name]}
              label={labelFor(name)}
              checked={index === 0}
              onChange={noop}
            />
          ))}
        </div>
        <BoxWrapper className="h-auto gap-0 overflow-hidden p-0">
          <CollapsibleSection
            title={labelFor("team")}
            icon={<Users className="size-5 shrink-0" aria-hidden="true" />}
            className="bg-transparent"
            open
            preview={null}
          >
            <p className="text-sm text-base-content/70">
              Aucun membre « {labelFor("team")} » renseigné
            </p>
          </CollapsibleSection>
        </BoxWrapper>
      </div>
    </section>
  );
};

export default RoleLabelsPreview;
