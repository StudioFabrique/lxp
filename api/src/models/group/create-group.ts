import Group, { type IGroup } from "../../utils/interfaces/db/group.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";
import activateMultipleUsers from "../user/activate-multiple-users.ts";
import { exactInsensitive } from "../../utils/unique-fields.ts";

export default async function createGroup(
  group: IGroup,
  users: IUser[],
  image: Buffer | undefined,
  parcoursId?: number,
) {
  const name = group.name?.trim() ?? "";

  if (name.length === 0) {
    throw {
      statusCode: 400,
      message: "Le nom du groupe est obligatoire.",
    };
  }

  // Comparaison insensible à la casse et aux espaces de bordure : « Promo
  // 2025 » et « promo 2025 » désignent le même groupe pour un formateur, et
  // rien au niveau du schéma n'empêche les deux de coexister.
  const groupToFind = await Group.findOne({ name: exactInsensitive(name) });
  if (groupToFind) {
    throw {
      statusCode: 409,
      message: "Un groupe portant ce nom existe déjà.",
    };
  }

  group.name = name;

  await activateMultipleUsers(users);

  group.roles = await Role.find({ role: "student", rank: 3 });

  const usersId = users.map((user) => user._id);

  group.users = await User.find({
    _id: { $in: usersId },
  });

  if (!!image) {
    group.image = image;
  }

  const createdGroup = await Group.create(group);

  if (!createdGroup) {
    return null;
  }

  await prisma.group.create({
    data: {
      idMdb: createdGroup._id,
      parcours: parcoursId ? { create: { parcoursId } } : undefined,
    },
  });

  await User.updateMany(
    { _id: { $in: usersId } },
    { $push: { group: createdGroup._id } },
  );

  return createdGroup;
}
