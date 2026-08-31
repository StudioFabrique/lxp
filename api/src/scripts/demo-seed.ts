import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { isDemoMode } from "../config/config.ts";
import { prisma } from "../utils/db.ts";
import mongoConnect from "../utils/services/db/mongo-connect.ts";
import User from "../utils/interfaces/db/user.ts";
import Group from "../utils/interfaces/db/group.ts";
import Role from "../utils/interfaces/db/role.ts";
import { env } from "../config/env.ts";

/**
 * Prépare les deux comptes empruntés par les visiteurs de la démonstration.
 *
 * Ces comptes portent les rôles ordinaires, avec toutes leurs permissions : une
 * ability réduite à la lecture ferait *disparaître* les boutons d'action plutôt
 * que les afficher inertes, `PermissionGuard` masquant ce qu'il refuse, et
 * l'interface d'administration paraîtrait amputée. C'est le verrou
 * `demo-read-only` qui interdit d'écrire, pas leurs droits.
 *
 * Idempotent : il complète et répare, il ne recrée pas. Il est fait pour tourner
 * après chaque restauration du jeu de démonstration.
 */

const PROFILES = [
  {
    variable: "DEMO_ADMIN_EMAIL",
    role: "admin",
    interfaceRole: "interface:admin",
    firstname: "Camille",
    lastname: "Démo",
  },
  {
    variable: "DEMO_STUDENT_EMAIL",
    role: "student",
    interfaceRole: "interface:student",
    firstname: "Alex",
    lastname: "Démo",
  },
] as const;

async function ensureAccount(profile: (typeof PROFILES)[number]) {
  const email = env[profile.variable]?.toLowerCase();
  if (!email) {
    throw new Error(
      `${profile.variable} n'est pas renseignée : impossible de préparer le compte « ${profile.role} ».`,
    );
  }

  const [role, interfaceRole] = await Promise.all([
    Role.findOne({ role: profile.role }),
    Role.findOne({ role: profile.interfaceRole }),
  ]);

  if (!role || !interfaceRole) {
    throw new Error(
      `Rôles « ${profile.role} » ou « ${profile.interfaceRole} » absents : appliquez d'abord les fixtures de rôles.`,
    );
  }

  let user = await User.findOne({ email });

  if (!user) {
    // Mot de passe aléatoire jamais communiqué : on n'entre pas dans la
    // démonstration par le formulaire de connexion mais par /v1/demo/session.
    user = await User.create({
      firstname: profile.firstname,
      lastname: profile.lastname,
      email,
      password: await bcrypt.hash(`${randomUUID()}@Dm99`, 10),
      isActive: true,
      emailVerified: true,
      roles: [role._id, interfaceRole._id],
    });
    console.log(`  compte créé : ${email}`);
  } else {
    console.log(`  compte existant : ${email}`);
  }

  // Un compte inactif est refusé par `authenticateSession`, et l'onboarding
  // serveur doit rester neutre : le compte étant partagé par tous les visiteurs
  // simultanés, le premier qui terminerait le tutoriel le supprimerait pour les
  // suivants. Le tour de démonstration vit côté navigateur.
  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        isActive: true,
        roles: [role._id, interfaceRole._id],
        onboarding: { status: "skipped", step: "", version: 1 },
      },
    },
  );

  const idMdb = user._id.toString();

  // Miroirs PostgreSQL, sans lesquels le compte est inutilisable : c'est la
  // règle appliquée par `models/user/create-user.ts` à toute création.
  if (role.rank === 1 || role.rank === 2) {
    const existing = await prisma.admin.findFirst({ where: { idMdb } });
    if (!existing) await prisma.admin.create({ data: { idMdb } });
  }

  if (role.rank === 2) {
    const existing = await prisma.contact.findUnique({ where: { idMdb } });
    if (!existing) {
      await prisma.contact.create({
        data: {
          idMdb,
          role: role.label,
          phone: "Non Renseigné",
          email,
        },
      });
    }
  }

  if (role.rank === 3) {
    const existing = await prisma.student.findUnique({ where: { idMdb } });
    if (!existing) await prisma.student.create({ data: { idMdb } });
  }

  return { user, role };
}

/**
 * Rattache l'apprenant de démonstration à un parcours publié.
 *
 * L'inscription est à cheval sur les deux bases : l'appartenance au groupe vit
 * dans Mongo, le rattachement du groupe au parcours dans PostgreSQL, et les deux
 * se rejoignent par `idMdb`. Sans ce montage, `check-content-access` répond 404
 * sur tout le contenu — et la démonstration apprenant serait vide.
 */
async function ensureEnrollment(userId: string) {
  const parcoursPublies = await prisma.parcours.findMany({
    where: { isPublished: true },
    select: { id: true },
  });

  if (parcoursPublies.length === 0) {
    console.warn(
      "  ⚠ aucun parcours publié : l'apprenant de démonstration ne verra aucun contenu.",
    );
    return;
  }

  const dejaInscrit = await Group.findOne({ users: userId });
  if (dejaInscrit) {
    const groupePg = await prisma.group.findFirst({
      where: { idMdb: dejaInscrit.id as string },
      select: { id: true },
    });
    if (groupePg) {
      const liens = await prisma.groupsOnParcours.count({
        where: { groupId: groupePg.id },
      });
      if (liens > 0) {
        console.log("  inscription déjà en place");
        return;
      }
    }
  }

  const roleStudent = await Role.findOne({ role: "student" });
  const groupeMongo =
    dejaInscrit ??
    (await Group.create({
      name: "Promotion démonstration",
      users: [userId],
      roles: roleStudent ? [roleStudent._id] : [],
      isActive: true,
    }));

  const idMdb = groupeMongo.id as string;
  const groupePg =
    (await prisma.group.findFirst({
      where: { idMdb },
      select: { id: true },
    })) ??
    (await prisma.group.create({ data: { idMdb }, select: { id: true } }));

  await prisma.groupsOnParcours.createMany({
    data: parcoursPublies.map((parcours) => ({
      groupId: groupePg.id,
      parcoursId: parcours.id,
    })),
    skipDuplicates: true,
  });

  console.log(
    `  inscription créée sur ${parcoursPublies.length} parcours publié(s)`,
  );
}

async function main() {
  if (!isDemoMode()) {
    throw new Error(
      "DEMO_MODE n'est pas activé : ce script ne doit tourner que sur l'instance de démonstration.",
    );
  }

  await mongoConnect();
  console.log("Préparation des comptes de démonstration…");

  for (const profile of PROFILES) {
    const { user, role } = await ensureAccount(profile);
    if (role.rank === 3) await ensureEnrollment(user._id.toString());
  }

  console.log("\x1b[32mComptes de démonstration prêts.\x1b[0m");
}

main()
  .catch((error) => {
    console.error("\x1b[31m" + (error?.message ?? error) + "\x1b[0m");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  });
