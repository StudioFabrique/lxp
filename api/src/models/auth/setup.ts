import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/db.ts";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token.ts";
import Role from "../../utils/interfaces/db/role.ts";
import { type IRole } from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { env } from "../../config/env.ts";
import {
  exactInsensitive,
  isDuplicateKeyError,
  normalizeEmail,
} from "../../utils/unique-fields.ts";

type FirstAdminInput = {
  token: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

type RootActivationPayload = {
  purpose: "first-admin" | "root-account";
  email?: string;
};

function verifyRootActivationToken(token: string): RootActivationPayload {
  let data: unknown;
  try {
    data = jwt.verify(token, env.REGISTER_SECRET);
  } catch {
    throw {
      statusCode: 401,
      message: "Le token est invalide ou a expiré.",
    };
  }

  if (
    typeof data !== "object" ||
    data === null ||
    !("purpose" in data) ||
    !["first-admin", "root-account"].includes(String(data.purpose))
  ) {
    throw {
      statusCode: 401,
      message: "Le token n'est pas valide pour cette opération.",
    };
  }

  const payload = data as RootActivationPayload;
  if (
    payload.purpose === "root-account" &&
    (typeof payload.email !== "string" || payload.email.length === 0)
  ) {
    throw {
      statusCode: 401,
      message: "Le token ne contient aucune adresse email valide.",
    };
  }

  return payload;
}

async function findAdminRoleAndCount() {
  const rootRole = await Role.findOne({ role: "root", rank: 0 });
  const privilegedRoles = await Role.find({ rank: { $lte: 1 } }).select("_id");

  const adminCount = await User.countDocuments({
    roles: { $in: privilegedRoles.map(({ _id }) => _id) },
    isActive: true,
  });
  return { rootRole, adminCount };
}

export async function getSetupStatus() {
  const { adminCount } = await findAdminRoleAndCount();
  return adminCount > 0;
}

export async function validateFirstAdminToken(token: string) {
  const payload = verifyRootActivationToken(token);
  const { adminCount } = await findAdminRoleAndCount();
  if (adminCount > 0) {
    throw {
      statusCode: 400,
      message: "Un administrateur existe déjà. Ce token n'est plus valide.",
    };
  }

  return payload;
}

async function createRootUser(
  input: FirstAdminInput,
  expectedExistingAdmins: boolean,
) {
  const payload = verifyRootActivationToken(input.token);

  if (expectedExistingAdmins && payload.purpose !== "root-account") {
    throw {
      statusCode: 401,
      message: "Ce token ne permet pas de créer un nouveau compte root.",
    };
  }

  if (await BlackListedToken.findOne({ token: input.token })) {
    throw { statusCode: 400, message: "Ce token a déjà été utilisé." };
  }

  const { rootRole, adminCount } = await findAdminRoleAndCount();
  if (!rootRole) {
    throw {
      statusCode: 500,
      message: "Le rôle root n'existe pas.",
    };
  }
  if (!expectedExistingAdmins && adminCount > 0) {
    throw {
      statusCode: 400,
      message: "Un administrateur existe déjà. Ce token n'est plus valide.",
    };
  }
  if (expectedExistingAdmins && adminCount === 0) {
    throw {
      statusCode: 400,
      message: "Aucun administrateur n'existe encore. Utilisez la page d'initialisation.",
    };
  }

  const email = normalizeEmail(input.email);
  if (
    payload.purpose === "root-account" &&
    normalizeEmail(payload.email ?? "") !== email
  ) {
    throw {
      statusCode: 400,
      message: "L'adresse email ne correspond pas à celle de l'invitation.",
    };
  }

  if (await User.findOne({ email: exactInsensitive(email) })) {
    throw {
      statusCode: 409,
      message: "Un utilisateur a déjà été enregistré avec cette adresse email.",
    };
  }

  let createdUser;
  try {
    createdUser = await User.create({
      email,
      firstname: input.firstname.toLowerCase(),
      lastname: input.lastname.toLowerCase(),
      password: await hash(input.password, 10),
      isActive: true,
      emailVerified: true,
      roles: [rootRole._id],
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw {
        statusCode: 409,
        message: "Un utilisateur a déjà été enregistré avec cette adresse email.",
      };
    }
    throw error;
  }

  await prisma.admin.create({ data: { idMdb: createdUser._id.toString() } });
  await BlackListedToken.create({ token: input.token });
  return createdUser._id.toString();
}

export async function createFirstAdmin(input: FirstAdminInput) {
  return createRootUser(input, false);
}

export async function createRootAccount(input: FirstAdminInput) {
  return createRootUser(input, true);
}

export async function promoteAdminToRoot(token: string, userId: string) {
  const payload = verifyRootActivationToken(token);
  if (payload.purpose !== "first-admin") {
    throw {
      statusCode: 401,
      message: "Ce token ne permet pas de promouvoir un compte existant.",
    };
  }

  if (await BlackListedToken.findOne({ token })) {
    throw { statusCode: 400, message: "Ce token a déjà été utilisé." };
  }

  const [rootRole, user] = await Promise.all([
    Role.findOne({ role: "root", rank: 0 }),
    User.findById(userId).populate("roles"),
  ]);

  if (!rootRole) {
    throw { statusCode: 500, message: "Le rôle root n'existe pas." };
  }
  if (!user || !user.isActive) {
    throw { statusCode: 404, message: "Utilisateur introuvable." };
  }

  const roles = user.roles as unknown as IRole[];
  if (!roles.some(({ role, rank }) => role === "admin" && rank === 1)) {
    throw {
      statusCode: 403,
      message: "Seul un utilisateur administrateur peut devenir root.",
    };
  }

  await User.updateOne({ _id: user._id }, { $set: { roles: [rootRole._id] } });
  await BlackListedToken.create({ token });
}
