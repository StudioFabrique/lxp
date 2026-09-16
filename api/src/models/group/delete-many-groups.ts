import { whereFromObject } from "../../utils/prisma-query.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function deleteManyGroups(groupsIds: string[]) {
  try {
    const groups = await Group.find({
      _id: { $in: groupsIds },
    });

    const userIds = groups.flatMap((group) =>
      (group.users || []).map((user) => user._id),
    );

    await Group.deleteMany({
      _id: { $in: groupsIds },
    });

    if (userIds.length > 0) {
      await User.updateMany(
        { _id: { $in: userIds } },
        { $pull: { group: { $in: groups.map((group) => group._id) } } },
      );
    }

    await prisma.transaction(async (tx) => {
      await tx.orm.public.GroupsOnParcours.where((row) =>
        whereFromObject(row, {
          group: { idMdb: { in: groupsIds } },
        }),
      ).deleteAndCount();
      await tx.orm.public.Group.where((row) =>
        whereFromObject(row, { idMdb: { in: groupsIds } }),
      ).deleteAndCount();
    });

    return groups ?? [];
  } catch (error) {
    return [];
  }
}
