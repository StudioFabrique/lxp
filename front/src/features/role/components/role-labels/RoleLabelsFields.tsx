import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import {
  DEFAULT_ROLE_LABELS,
  ROLE_LABEL_FIELDS,
  type RoleLabelFieldName,
  type RoleLabelsFormValues,
} from "../../helpers/role-labels";
import RoleLabelField from "./RoleLabelField";
import RoleLabelsPreview from "./RoleLabelsPreview";

type RoleLabelsFieldsProps = {
  /** Branche un champ sur le formulaire parent (`register` de RHF, éventuellement préfixé). */
  register: (name: RoleLabelFieldName) => UseFormRegisterReturn;
  errors?: Partial<Record<RoleLabelFieldName, FieldError>>;
  /** Valeurs en cours de saisie, pour l'aperçu. */
  values: RoleLabelsFormValues;
  disabled?: boolean;
};

// Intitulés courts : sur une seule ligne, pour que les champs d'une même rangée restent alignés.
const FIELD_COPY: Record<RoleLabelFieldName, { label: string; description: string }> = {
  admin: {
    label: "Administration",
    description: "Gère la plateforme, les utilisateurs et les rôles.",
  },
  team: {
    label: "Accompagnement",
    description: "Conçoit les parcours et accompagne les apprenants.",
  },
  student: {
    label: "Apprentissage",
    description: "Suit les parcours et réalise les activités.",
  },
  visitor: {
    label: "Consultation",
    description: "Consulte la plateforme avec des droits limités.",
  },
};

const FIELD_NAMES = Object.keys(ROLE_LABEL_FIELDS) as RoleLabelFieldName[];

/** Les quatre libellés de rôles de l'instance, rattachés au formulaire d'onboarding parent. */
/** Les quatre libellés de rôles de l'instance et leur aperçu, rattachés au formulaire du parent. */
const RoleLabelsFields = ({
  register,
  errors,
  values,
  disabled,
}: RoleLabelsFieldsProps) => (
  <>
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2">
      {FIELD_NAMES.map((name, index) => (
        <RoleLabelField
          key={name}
          label={FIELD_COPY[name].label}
          description={FIELD_COPY[name].description}
          defaultLabel={DEFAULT_ROLE_LABELS[ROLE_LABEL_FIELDS[name]]}
          registration={register(name)}
          error={errors?.[name]}
          disabled={disabled}
          tooltipPosition={index % 2 === 0 ? "right" : "left"}
        />
      ))}
    </div>
    <RoleLabelsPreview values={values} />
  </>
);

export default RoleLabelsFields;
