import User from "../../interfaces/db/user.ts";
import Role from "../../interfaces/db/role.ts";

/** Conserve le rôle métier le plus privilégié des anciens comptes. */
export default async function normalizeUserRoles() {
  const roles = await Role.find({ role: { $not: /^interface:/ } }).sort({ rank: 1, _id: 1 });
  const rootRole = roles.find(({ role, rank }) => role === "root" && rank === 0);
  const adminRole = roles.find(({ role, rank }) => role === "admin" && rank === 1);
  const studentRole = roles.find(({ role }) => role === "student");
  const users = User.find({}).select("roles isActive createdAt")
    .sort({ isActive: -1, createdAt: 1, _id: 1 }).lean().cursor();
  let rootKept = false;
  for await (const user of users) {
    const ids = (Array.isArray(user.roles) ? user.roles : [user.roles]).map(String);
    let role = roles.find(({ _id }) => ids.includes(String(_id)));
    const orphan = !role;
    // Un compte sans rôle métier est désactivé, sans lui accorder de droits staff.
    role ??= studentRole;
    if (role?.rank === 0) {
      role = rootKept ? adminRole : rootRole;
      rootKept = true;
    }
    if (!role) throw new Error(`Aucun rôle de remplacement pour le compte ${user._id}`);
    if (!Array.isArray(user.roles) || ids.length !== 1 || ids[0] !== String(role._id) || orphan) {
      await User.updateOne({ _id: user._id }, {
        $set: { roles: [role._id], ...(orphan ? { isActive: false } : {}) },
      });
    }
  }

  await User.createCollection();
  // Couvre aussi updateMany, bulkWrite, imports et écritures hors Mongoose.
  await User.db.db!.command({
    collMod: User.collection.collectionName,
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["roles"],
        properties: {
          roles: { bsonType: "array", minItems: 1, maxItems: 1, items: { bsonType: "objectId" } },
        },
      },
    },
    validationLevel: "strict",
    validationAction: "error",
  });
  if (rootRole) {
    await User.collection.createIndex({ roles: 1 }, {
      name: "unique_root_user",
      unique: true,
      partialFilterExpression: { roles: rootRole._id },
    });
  }
}
