import mongoose from "mongoose";
import mongoConnect from "../utils/services/db/mongo-connect";
import { resourcesRbacByRank } from "../utils/rbac/config/ressources-rbac";

async function migrateRbacCasl() {
  await mongoConnect();
  const db = mongoose.connection.db;
  if (!db) throw new Error("MongoDB connection is not ready");

  const roles = db.collection("roles");
  const permissions = db.collection("permissions");
  const legacyPermissions = await permissions
    .find({ roles: { $exists: true, $ne: [] } })
    .toArray();

  for (const permission of legacyPermissions) {
    for (const roleId of permission.roles || []) {
      await roles.updateOne(
        { _id: roleId },
        { $addToSet: { permissions: permission._id } },
      );
    }
  }

  for (const permission of legacyPermissions) {
    for (const roleId of permission.roles || []) {
      const migrated = await roles.countDocuments({
        _id: roleId,
        permissions: permission._id,
      });
      if (migrated !== 1) {
        throw new Error(
          `RBAC migration verification failed for permission ${permission._id} and role ${roleId}`,
        );
      }
    }
  }

  const systemRolePermissions: Record<string, string[]> = {
    admin: ["read", "write", "update", "delete"].flatMap((action) =>
      resourcesRbacByRank[1][
        action as "read" | "write" | "update" | "delete"
      ].map((resource) => `${action}:${resource}`),
    ),
    teacher: ["read", "write", "update", "delete"].flatMap((action) =>
      resourcesRbacByRank[2][
        action as "read" | "write" | "update" | "delete"
      ].map((resource) => `${action}:${resource}`),
    ),
    student: ["read", "write", "update", "delete"].flatMap((action) =>
      resourcesRbacByRank[3][
        action as "read" | "write" | "update" | "delete"
      ].map((resource) => `${action}:${resource}`),
    ),
    "interface:admin": [
      "layout:admin",
      "layout:teacher",
      "layout:student",
      "component:calendar",
      "component:company-picture-upload",
    ],
    "interface:teacher": [
      "layout:teacher",
      "layout:student",
      "component:calendar",
      "component:lessons-rating-stats",
      "component:last-feedback",
    ],
    "interface:student": [
      "layout:student",
      "component:calendar",
      "component:start-lesson-button",
      "component:progression",
    ],
  };

  for (const [roleName, permissionNames] of Object.entries(
    systemRolePermissions,
  )) {
    for (const permissionName of permissionNames) {
      await permissions.updateOne(
        { name: permissionName },
        {
          $setOnInsert: {
            name: permissionName,
            isRole: false,
          },
        },
        { upsert: true },
      );
      const permission = await permissions.findOne({ name: permissionName });
      if (!permission) {
        throw new Error(`Unable to create permission ${permissionName}`);
      }
      await roles.updateOne(
        { role: roleName },
        { $addToSet: { permissions: permission._id } },
      );
    }
  }

  await permissions.updateMany({}, { $unset: { roles: "" } });
  console.log(
    `RBAC migration complete: ${legacyPermissions.length} legacy permission documents checked and ${Object.keys(systemRolePermissions).length} system roles synchronized.`,
  );
  await mongoose.disconnect();
}

migrateRbacCasl().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
