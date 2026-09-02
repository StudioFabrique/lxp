import Permission from "../../interfaces/db/permission.ts";
import Role from "../../interfaces/db/role.ts";

/** Retire les droits de création globaux des rôles héritant du modèle formateur. */
export default async function syncTeacherContentRbac() {
  const permissions = await Permission.find({
    name: { $in: ["write:formation", "write:parcours"] },
  }).select("_id");

  if (permissions.length === 0) return;

  await Role.updateMany(
    { rank: 2 },
    { $pull: { permissions: { $in: permissions.map(({ _id }) => _id) } } },
  );
}
