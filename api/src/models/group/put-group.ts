import { prisma } from "../../utils/db";
import Group, { IGroup } from "../../utils/interfaces/db/group";
import User, { IUser } from "../../utils/interfaces/db/user";
import activateMultipleUsers from "../user/activate-multiple-users";

export default async function putGroup(
  id: string,
  group: IGroup,
  users: IUser[],
  image: Buffer | undefined,
  parcoursId?: number,
) {
  // Find the group by id
  const groupToFind = await Group.findOne({ _id: id });
  if (!groupToFind) return null;

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
    );

    const existingPrismaGroup = await prisma.group.findFirst({
      where: { idMdb: id },
    });

    if (!existingPrismaGroup) return null;

    if (parcoursId) {
      // First delete any existing relationship for this group
      await prisma.groupsOnParcours.deleteMany({
        where: {
          groupId: existingPrismaGroup.id,
        },
      });

      // Then create the new relationship
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

    await User.updateMany(
      { _id: { $in: usersId } },
      { $push: { group: updatedGroup?._id } },
    );

    return updatedGroup;
  } catch (error) {
    console.error("Error updating group:", error);
    return null;
  }
}
