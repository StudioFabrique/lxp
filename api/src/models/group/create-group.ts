import Group, { type IGroup } from "../../utils/interfaces/db/group.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";
import activateMultipleUsers from "../user/activate-multiple-users.ts";

export default async function createGroup(
  group: IGroup,
  users: IUser[],
  image: Buffer | undefined,
  parcoursId?: number,
) {
  const groupToFind = await Group.findOne({ name: group.name });
  if (groupToFind) {
    return null;
  }

  await activateMultipleUsers(users);

  group.roles = await Role.find({ role: "student", rank: 3 });

  const usersId = users.map((user) => user._id);

  group.users = await User.find({
    _id: { $in: usersId },
  });

  if (!!image) {
    group.image = image;
  }

  const createdGroup = await Group.create(group);

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
    { _id: { $in: usersId } },
    { $push: { group: createdGroup._id } },
  );

  return createdGroup;
}
