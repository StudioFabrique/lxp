import Group, { IGroup } from "../../utils/interfaces/db/group";
import Role from "../../utils/interfaces/db/role";
import { IUser } from "../../utils/interfaces/db/user";
import updateManyUsers from "../user/update-many-users";
import { prisma } from "../../utils/db";

export default async function createGroup(
  group: IGroup,
  users: IUser[],
  parcoursId?: number,
  formationId?: number
) {
  const groupToFind = await Group.findOne({ name: group.name });
  if (groupToFind) {
    return null;
  }

  const newGroup: IGroup = group;

  newGroup.roles = await Role.find({ role: "student", rank: 3 });

  newGroup.users = await updateManyUsers(users);

  const createdGroup = await Group.create(newGroup);

  if (!createdGroup) {
    return null;
  }

  await prisma.group.create({
    data: {
      idMdb: createdGroup._id,
      parcours: { connect: { id: parcoursId } },
    },
  });

  return createdGroup;
}
