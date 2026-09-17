import { whereFromObject } from "../../utils/prisma-query.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function deleteGroup(groupId: string) {
  try {
    const group = await Group.findOneAndDelete({
      _id: groupId,
    });

    await User.updateMany(
      { _id: { $in: (group?.users ?? []).map((user) => user._id) } },
      { $pull: { group: group?._id } },
    );

    await prisma.transaction(async (tx) => {
      await tx.orm.public.GroupsOnParcours.where((row) =>
        whereFromObject(row, {
          group: { idMdb: groupId },
        }),
      ).deleteAndCount();
      await tx.orm.public.Group.where((row) =>
        whereFromObject(row, {
          idMdb: groupId,
        }),
      ).deleteAndCount();
    });

    return group ?? [];
  } catch (error) {
    return [];
  }
}
