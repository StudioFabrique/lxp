import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function deleteManyGroups(groupsIds: string[]) {
  try {
    const groups = await Group.find({
      _id: { $in: groupsIds },
    });

    const userIds = groups.flatMap((group) => group.users || []);

    await Group.deleteMany({
      _id: { $in: groupsIds },
    });

    if (userIds.length > 0) {
      await User.updateMany(
        { _id: { $in: userIds } },
        { $unset: { group: { $in: groupsIds } } },
      );
    }

    await prisma.$transaction([
      prisma.groupsOnParcours.deleteMany({
        where: {
          group: { idMdb: { in: groupsIds } },
        },
      }),
      prisma.group.deleteMany({
        where: { idMdb: { in: groupsIds } },
      }),
    ]);

    return groups ?? [];
  } catch (error) {
    return [];
  }
}
