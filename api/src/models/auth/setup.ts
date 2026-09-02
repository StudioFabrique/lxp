import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/db.ts";
import BlackListedToken from "../../utils/interfaces/db/blacklisted-token.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { env } from "../../config/env.ts";

type FirstAdminInput = {
  token: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
};

function verifyFirstAdminToken(token: string) {
  let data: any;
  try {
    data = jwt.verify(token, env.REGISTER_SECRET);
  } catch {
    throw {
      statusCode: 401,
      message: "Le token est invalide ou a expiré.",
    };
  }

  if (data.purpose !== "first-admin") {
    throw {
      statusCode: 401,
      message: "Le token n'est pas valide pour cette opération.",
    };
  }
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
  verifyFirstAdminToken(token);
  const { adminCount } = await findAdminRoleAndCount();
  if (adminCount > 0) {
    throw {
      statusCode: 400,
      message: "Un administrateur existe déjà. Ce token n'est plus valide.",
    };
  }
}

export async function createFirstAdmin(input: FirstAdminInput) {
  verifyFirstAdminToken(input.token);

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
  if (adminCount > 0) {
    throw {
      statusCode: 400,
      message: "Un administrateur existe déjà. Ce token n'est plus valide.",
    };
  }

  const email = input.email.toLowerCase();
  if (await User.findOne({ email })) {
    throw {
      statusCode: 409,
      message: "Un utilisateur a déjà été enregistré avec cette adresse email.",
    };
  }

  const createdUser = await User.create({
    email,
    firstname: input.firstname.toLowerCase(),
    lastname: input.lastname.toLowerCase(),
    password: await hash(input.password, 10),
    isActive: true,
    emailVerified: true,
    roles: [rootRole._id],
  });

  await prisma.admin.create({ data: { idMdb: createdUser._id.toString() } });
  await BlackListedToken.create({ token: input.token });
  return createdUser._id.toString();
}
