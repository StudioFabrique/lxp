import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function deleteGroup(groupId: string) {
  try {
    const group = await Group.findOneAndRemove({
      _id: groupId,
    });

    await User.updateMany(
      { _id: group?.users },
      { $unset: { group: groupId } },
    );

    await prisma.$transaction([
      prisma.groupsOnParcours.deleteMany({
        where: {
          group: { idMdb: groupId },
        },
      }),
      prisma.group.deleteMany({
        where: {
          idMdb: groupId,
        },
      }),
    ]);

    return group ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
