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
  if (!groupToFind) {
    return null;
  }

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

    if (parcoursId) {
      await prisma.groupsOnParcours.updateMany({
        where: { group: { idMdb: id } },
        data: { parcoursId },
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
