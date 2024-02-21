import Group from "../../utils/interfaces/db/group";

export default async function getUserGroupId(userMdbId: string) {
  const group = await Group.findOne({ users: userMdbId });

  return group?.id;
}
