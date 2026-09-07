import Permission from "../../interfaces/db/permission.ts";
import Role from "../../interfaces/db/role.ts";

/** Aligne les rôles formateur existants sur les restrictions du modèle. */
export default async function syncTeacherContentRbac() {
  const [permissionsToRemove, tagPermissions] = await Promise.all([
    Permission.find({
      name: {
        $in: [
          "write:formation",
          "write:parcours",
          "update:formation",
          "delete:formation",
        ],
      },
    }).select("_id"),
    Promise.all(
      ["write:tag", "update:tag", "delete:tag"].map((name) =>
        Permission.findOneAndUpdate(
          { name },
          { $setOnInsert: { name, isRole: false } },
          { upsert: true, new: true },
        ),
      ),
    ),
  ]);

  const teacherFilter = { role: "teacher", rank: 2 };
  await Role.updateMany(teacherFilter, {
    $pull: {
      permissions: { $in: permissionsToRemove.map(({ _id }) => _id) },
    },
  });
  await Role.updateMany(teacherFilter, {
    $addToSet: {
      permissions: { $each: tagPermissions.map(({ _id }) => _id) },
    },
  });
}
