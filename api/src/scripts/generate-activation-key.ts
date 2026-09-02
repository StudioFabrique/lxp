import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Role from "../utils/interfaces/db/role.ts";
import Permission, { type IPermission } from "../utils/interfaces/db/permission.ts";
import {
  permDefsActions,
} from "../utils/rbac/config/fixtures-permissions.ts";
import { env } from "../config/env.ts";

const MONGO_URL = env.MONGO_LOCAL_URL;
const secret = env.REGISTER_SECRET;

if (!secret || !MONGO_URL) {
  console.error(
    "Erreur: Les variables d'environnement REGISTER_SECRET et MONGO_LOCAL_URL doivent être définies.",
  );
  process.exit(1);
}

const registerSecret = secret;
const mongoUrl = MONGO_URL;

async function seedRoles() {
  const existingCount = await Role.countDocuments();
  const actionsRoles = [
    {
      role: "root",
      label: "root",
      rank: 0,
      protection: 2,
    },
    { role: "admin", label: "administrateur", rank: 1, protection: 2 },
    { role: "teacher", label: "équipe pédagogique", rank: 2, protection: 1 },
    { role: "student", label: "apprenant", rank: 3, protection: 1 },
  ];

  await Promise.all(
    actionsRoles.map((role) =>
      Role.updateOne(
        { role: role.role },
        role.role === "root" ? { $set: role } : { $setOnInsert: role },
        { upsert: true },
      ),
    ),
  );
  const totalCount = await Role.countDocuments();
  console.log(
    existingCount === 0
      ? `  ✓ ${totalCount} rôles créés.`
      : `  ✓ ${totalCount} rôles disponibles, rôles système vérifiés.`,
  );
}

async function seedPermissions() {
  const existingCount = await Permission.countDocuments();
  console.log(
    existingCount > 0
      ? "Vérification des permissions des rôles système..."
      : "Création des permissions...",
  );

  const bulkPermissions = new Map<string, IPermission>();
  const bulkRoleUpdates = new Map<string, any>();

  for (const [roleName, value] of Object.entries({
    ...permDefsActions,
  })) {
    const role = await Role.findOne({ role: roleName });
    if (!role) continue;
    // Ne réinitialise pas les permissions personnalisables d'une installation
    // existante. Le rôle root nouvellement ajouté est vide et
    // reçoit ici sa matrice complète.
    if (role.permissions.length > 0) continue;

    const rolePermissions: any[] = [];

    for (const [action, ressources] of Object.entries(value)) {
      for (const res of ressources) {
        const permissionName = `${action}:${res}`;

        if (!bulkPermissions.has(permissionName)) {
          const existingPermission = await Permission.findOne({
            name: permissionName,
          });

          if (existingPermission) {
            bulkPermissions.set(permissionName, existingPermission);
            rolePermissions.push(existingPermission._id);
          } else {
            const newPermission = new Permission({
              name: permissionName,
            });
            bulkPermissions.set(permissionName, newPermission);
            rolePermissions.push(newPermission._id);
          }
        } else {
          const permission = bulkPermissions.get(permissionName)!;
          rolePermissions.push(permission._id);
        }
      }
    }

    bulkRoleUpdates.set(role._id.toString(), {
      updateOne: {
        filter: { _id: role._id },
        update: { $set: { permissions: rolePermissions } },
      },
    });
  }

  if (bulkPermissions.size > 0) {
    await Permission.bulkSave(Array.from(bulkPermissions.values()));
  }
  if (bulkRoleUpdates.size > 0) {
    await Role.bulkWrite(Array.from(bulkRoleUpdates.values()));
  }
  console.log(
    `  ✓ ${await Permission.countDocuments()} permissions disponibles.`,
  );
}

async function main() {
  console.log("\n══════════════════════════════════════════════════");
  console.log("  Initialisation de la plateforme ANDRIA");
  console.log("══════════════════════════════════════════════════\n");

  console.log("[1/3] Connexion à MongoDB...");
  await mongoose.connect(mongoUrl);
  console.log("  ✓ Connecté.\n");

  console.log("[2/3] Vérification des rôles et permissions...");
  await seedRoles();
  await seedPermissions();
  console.log("");

  const token = jwt.sign({ purpose: "first-admin" }, registerSecret, {
    expiresIn: env.ROOT_ACTIVATION_TOKEN_TTL_MINUTES * 60,
  });

  console.log("[3/3] Génération de la clé d'activation...");
  console.log(`
                                   @@@@@@@@@@@@@@@
     @@   @@@   @@ @@@@@@  @@@@@@  @@@@@@@@@@@@@@@@
     @@@   @@@   @@@@@@@@@@ @@@@@@@ @@   @@@   @@@@@
    @@@@@@ @@@@  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@  @@@@
   @@@@@@@@@@@@@ @@@@@  @@@@@@@ @@@@@@@@@@   @@  @@@
   @@   @@@@@@@@ @@@@@@  @@@@@@  @@@@@   @  @@@  @@@
   @@   @@@@@@@@ @@@@@@  @@@@@@@@@@@@@   @  @@@  @@@
   @@@@@@@@@@ @@@@@@@@@  @@@@@@@@@@ @@   @       @@@
   @@@@@@@@@@  @@@@@@@@  @@@@@@@@@@ @@   @       @@@
   @@   @@@@@  @@@@@@@  @@@@@@   @@@@@   @  @@@  @@@
   @@   @@@@@  @@@@@@@@@@@@ @@   @@@@@   @  @@@  @@@
   @@   @@@@@   @@@@@@@@@@  @@   @@@@@   @  @@@  @@@
                                   @@@@@@@@@@@@@@@@
                                    @@@@@@@@@@@@@@`);

  console.log("\n══════════════════════════════════════════════════");
  console.log("  Clé d'activation du premier administrateur");
  console.log(`\n  ${token}`);
  console.log(
    `\n  Ce token est valide pendant ${env.ROOT_ACTIVATION_TOKEN_TTL_MINUTES} minute(s).`,
  );
  console.log("══════════════════════════════════════════════════\n");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("Erreur fatale:", err);
  process.exit(1);
});
