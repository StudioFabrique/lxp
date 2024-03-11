import Group, { IGroup } from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";

export default async function createGroup(
  group: IGroup,
  usersId: string[],
  image: Buffer | undefined,
  parcoursId?: number
) {
  const groupToFind = await Group.findOne({ name: group.name });
  if (groupToFind) {
    return null;
  }

  const newGroup: IGroup = group;

  newGroup.roles = await Role.find({ role: "student", rank: 3 });

  newGroup.users = await User.find({
    _id: { $in: usersId },
  });

  if (!!image) {
    newGroup.image = image;
  }

  const createdGroup = await Group.create(newGroup);

  if (!createdGroup) {
    return null;
  }

  await prisma.group.create({
    data: {
      idMdb: createdGroup._id,
      parcours: parcoursId ? { create: { parcoursId } } : undefined,
    },
  });

  await User.updateMany(
    { id: { usersId } },
    { $push: { group: createdGroup._id } }
  );

  return createdGroup;
}
