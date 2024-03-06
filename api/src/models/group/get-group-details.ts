import Group from "../../utils/interfaces/db/group";

export default async function getGroupDetails(groupId: string) {
  const group = await Group.findOne({
    _id: groupId,
  });

  return group;
}
