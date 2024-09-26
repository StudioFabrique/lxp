import Group, { IGroup } from "../../utils/interfaces/db/group";
import { IUser } from "../../utils/interfaces/db/user";

export default async function putGroup(
  id: string,
  group: IGroup,
  users: IUser[],
  image: Buffer | undefined,
  parcoursId?: number
) {
  // Find the group by id
  const groupToFind = await Group.findOne({ _id: id });
  if (!groupToFind) {
    return null;
  }

  const updateData: any = { ...group };

  if (image) {
    updateData.image = image;
  }

  const ids = users.map((user) => user._id);
  updateData.users = ids;

  try {
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: id },
      { $set: updateData }
    );

    if (parcoursId) {
      await prisma?.groupsOnParcours.updateMany({
        where: { group: { idMdb: id } },
        data: { parcoursId },
      });
    }

    return updatedGroup;
  } catch (error) {
    console.error("Error updating group:", error);
    return null;
  }
}
