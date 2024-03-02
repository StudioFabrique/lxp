import Group from "../../utils/interfaces/db/group";
import { prisma } from "../../utils/db";

export default async function deleteGroup(groupId: string) {
  const group = await Group.findOneAndRemove({
    _id: groupId,
  });

  console.log({ groupIdToDelete: groupId });

  console.log({ group });

  await prisma.group.deleteMany({ where: { idMdb: groupId } });

  return group ?? [];
}
