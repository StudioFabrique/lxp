import { prisma } from "../../utils/db.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";

/** Mongo tourne aussi sans replica set. Le verrou PostgreSQL sérialise les
 * transferts entre instances ; l'index Mongo garantit l'unicité du root. */
export default async function transferRoot(userId: string) {
  return prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`SELECT pg_advisory_xact_lock(718204913)`;
    const [rootRole, adminRole, target] = await Promise.all([
      Role.findOne({ role: "root", rank: 0 }),
      Role.findOne({ role: "admin", rank: 1 }),
      User.findById(userId),
    ]);
    if (!rootRole || !adminRole) {
      throw { statusCode: 500, message: "Les rôles root et administrateur sont requis." };
    }
    if (!target) {
      throw { statusCode: 404, message: "Utilisateur introuvable." };
    }
    // Également nécessaire si le premier rôle root vient d'être initialisé
    // après le démarrage du serveur.
    await User.collection.createIndex({ roles: 1 }, {
      name: "unique_root_user",
      unique: true,
      partialFilterExpression: { roles: rootRole._id },
    });
    const previousRoot = await User.findOne({
      roles: rootRole._id,
      _id: { $ne: target._id },
    });
    await User.updateMany(
      { roles: rootRole._id, _id: { $ne: target._id } },
      { $set: { roles: [adminRole._id] } },
    );
    try {
      const result = await User.updateOne(
        { _id: target._id },
        { $set: { roles: [rootRole._id] } },
        { runValidators: true },
      );
      if (result.matchedCount !== 1) {
        throw { statusCode: 409, message: "Le compte a changé pendant le transfert du rôle root." };
      }
    } catch (error) {
      if (previousRoot) {
        await User.updateOne(
          { _id: previousRoot._id, roles: adminRole._id },
          { $set: { roles: [rootRole._id] } },
        );
      }
      throw error;
    }
  }, { maxWait: 10000, timeout: 15000 });
}
