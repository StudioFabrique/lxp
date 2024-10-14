import Group, { IGroup } from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import activateMultipleUsers from "../user/activate-multiple-users";

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

  const newGroup: IGroup = group;

  newGroup.roles = await Role.find({ role: "student", rank: 3 });

  const usersId = users.map((user) => user._id);

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
    { _id: { $in: usersId } },
    { $push: { group: createdGroup._id } },
  );

  return createdGroup;
}
