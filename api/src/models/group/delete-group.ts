import Group from "../../utils/interfaces/db/group";
import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function deleteGroup(groupId: string) {
  try {
    const group = await Group.findOneAndRemove({
      _id: groupId,
    });

    await User.updateMany(
      { _id: group?.users },
      { $unset: { group: groupId } }
    );

    await prisma.group.deleteMany({ where: { idMdb: groupId } });

    return group ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
