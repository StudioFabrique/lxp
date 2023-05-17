import Group, { IGroup } from "../../utils/interfaces/db/group";

export default async function createGroup(group: IGroup) {
  const groupToFind = await Group.findOne({ name: group.name });
  if (groupToFind) {
    return null;
  }

  const createdGroup = await Group.create(group);

  return createdGroup;
}
