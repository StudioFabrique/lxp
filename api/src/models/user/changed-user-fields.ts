import type { IUser } from "../../utils/interfaces/db/user.ts";

export type UserChange = {
  label: string;
  /** Nouvelle valeur affichée ; `null` quand elle ne doit pas l'être (photo). */
  value: string | null;
};

type TrackedFields = Pick<
  IUser,
  | "firstname"
  | "lastname"
  | "nickname"
  | "description"
  | "address"
  | "city"
  | "postCode"
  | "birthDate"
  | "phoneNumber"
  | "avatar"
>;

const TEXT_FIELDS: ReadonlyArray<
  [Exclude<keyof TrackedFields, "birthDate" | "avatar">, string]
> = [
  ["firstname", "Prénom"],
  ["lastname", "Nom"],
  ["nickname", "Pseudo"],
  ["description", "Description"],
  ["address", "Adresse"],
  ["postCode", "Code postal"],
  ["city", "Ville"],
  ["phoneNumber", "Téléphone"],
];

const MAX_VALUE_LENGTH = 200;

/**
 * Absence de valeur, chaîne vide et espaces sont équivalents : un champ
 * optionnel renvoyé vide par un formulaire n'est pas une modification.
 */
const normalize = (value: string | undefined | null) => (value ?? "").trim();

const dayOf = (date: Date | undefined | null) =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

/**
 * Compare les champs du profil avant et après une mise à jour et retourne ceux
 * qui ont réellement changé. Les mots de passe, jetons et identifiants ne sont
 * jamais suivis ; la photo est signalée sans être affichée.
 */
export function changedUserFields(
  before: Partial<TrackedFields>,
  after: Partial<TrackedFields>,
): UserChange[] {
  const changes: UserChange[] = [];

  for (const [key, label] of TEXT_FIELDS) {
    const previous = normalize(before[key]);
    const next = normalize(after[key]);
    if (previous === next) continue;
    changes.push({
      label,
      value: next ? next.slice(0, MAX_VALUE_LENGTH) : "Supprimé",
    });
  }

  if (dayOf(before.birthDate) !== dayOf(after.birthDate)) {
    changes.push({
      label: "Date de naissance",
      value: after.birthDate
        ? new Date(after.birthDate).toLocaleDateString("fr-FR", {
            timeZone: "UTC",
          })
        : "Supprimée",
    });
  }

  const previousAvatar = before.avatar ? Buffer.from(before.avatar) : null;
  const nextAvatar = after.avatar ? Buffer.from(after.avatar) : null;
  const avatarChanged =
    previousAvatar === null || nextAvatar === null
      ? previousAvatar !== nextAvatar
      : !previousAvatar.equals(nextAvatar);
  if (avatarChanged) changes.push({ label: "Photo de profil", value: null });

  return changes;
}
