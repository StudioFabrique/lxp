import Role from "../../utils/interfaces/db/role.ts";
import type { RoleLabels } from "../../services/instance-settings.ts";

/**
 * Rôles système créés par le seed (`generate-activation-key.ts`), par rang.
 * Le rang 4 (visiteur) n'a pas de rôle système : son libellé ne vit que dans
 * les paramètres de l'instance.
 */
const SYSTEM_ROLES = [
  { role: "admin", rank: 1 },
  { role: "teacher", rank: 2 },
  { role: "student", rank: 3 },
] as const;

/**
 * Aligne le libellé des rôles système sur les libellés choisis pour
 * l'instance, afin que la gestion des rôles affiche les mêmes noms que le
 * reste de l'interface. Les libellés des rôles sont stockés en minuscules,
 * comme le seed et les validateurs de création de rôle. Idempotent : le
 * rejouer après un échec partiel est sans risque.
 */
export async function syncSystemRoleLabels(labels: RoleLabels): Promise<void> {
  await Promise.all(
    SYSTEM_ROLES.map(({ role, rank }) =>
      Role.updateOne(
        { role, rank, protection: { $gte: 1 } },
        { $set: { label: labels[String(rank) as keyof RoleLabels].toLocaleLowerCase("fr") } },
      ),
    ),
  );
}
