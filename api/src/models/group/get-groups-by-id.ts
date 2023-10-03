import Group from "../../utils/interfaces/db/group";

async function getGroupsById(groupsIds: Array<string>) {
  const ids = groupsIds.map((item: string) => {
    return new Object(item);
  });
  const groups = await Group.find({
    _id: { $in: ids },
  });

  return groups ?? [];
}

export default getGroupsById;
