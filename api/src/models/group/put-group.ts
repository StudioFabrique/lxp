import { prisma } from "../../utils/db.ts";
import Group, { type IGroup } from "../../utils/interfaces/db/group.ts";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import activateMultipleUsers from "../user/activate-multiple-users.ts";
import { logger } from "../../utils/logs/logger.ts";
import { exactInsensitive } from "../../utils/unique-fields.ts";

export default async function putGroup(
  id: string,
  group: IGroup,
  users: IUser[],
  image: Buffer | undefined,
  parcoursId?: number,
) {
  // Find the group by id
  const groupToFind = await Group.findOne({ _id: id });
  if (!groupToFind) {
    throw {
      statusCode: 404,
      message: "Le groupe n'existe pas.",
    };
  }

  const name = group.name?.trim() ?? "";

  if (name.length === 0) {
    throw {
      statusCode: 400,
      message: "Le nom du groupe est obligatoire.",
    };
  }

  // Même contrôle qu'à la création, en excluant le groupe modifié : renommer
  // un groupe avec le nom d'un autre passait sans aucun signalement.
  const nameOwner = await Group.findOne({
    name: exactInsensitive(name),
    _id: { $ne: groupToFind._id },
  });

  if (nameOwner) {
    throw {
      statusCode: 409,
      message: "Un groupe portant ce nom existe déjà.",
    };
  }

  group.name = name;

  await activateMultipleUsers(users);

  const updateData: any = { ...group };

  if (image) {
    updateData.image = image;
  }

  const usersId = users.map((user) => user._id);
  updateData.users = usersId;

  try {
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: id },
      { $set: updateData },
      { new: true },
    );

    await User.updateMany({ group: id }, { $pull: { group: id } });

    await User.updateMany(
      { _id: { $in: usersId } },
      { $addToSet: { group: id } },
    );

    const existingPrismaGroup = await prisma.group.findFirst({
      where: { idMdb: id },
    });

    if (!existingPrismaGroup) {
      throw {
        statusCode: 404,
        message: "Le groupe n'existe pas.",
      };
    }

    if (parcoursId !== undefined) {
      await prisma.groupsOnParcours.deleteMany({
        where: {
          groupId: existingPrismaGroup.id,
        },
      });

      if (parcoursId > 0) {
        await prisma.groupsOnParcours.create({
          data: {
            group: {
              connect: { id: existingPrismaGroup.id },
            },
            parcours: {
              connect: { id: parcoursId },
            },
          },
        });
      }
    }

    await User.updateMany(
      { _id: { $in: usersId } },
      { $push: { group: updatedGroup?._id } },
    );

    return updatedGroup;
  } catch (error) {
    logger.error("Error updating group:", error);
    throw error;
  }
}
