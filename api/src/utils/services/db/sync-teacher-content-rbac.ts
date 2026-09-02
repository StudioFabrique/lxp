import Permission from "../../interfaces/db/permission.ts";
import Role from "../../interfaces/db/role.ts";

/** Aligne les rôles formateur existants sur les restrictions du modèle. */
export default async function syncTeacherContentRbac() {
  const permissions = await Permission.find({
    name: {
      $in: [
        "write:formation",
        "write:parcours",
        "update:formation",
        "delete:formation",
      ],
    },
  }).select("_id");

  if (permissions.length === 0) return;

  await Role.updateMany(
    { role: "teacher", rank: 2 },
    { $pull: { permissions: { $in: permissions.map(({ _id }) => _id) } } },
  );
}
