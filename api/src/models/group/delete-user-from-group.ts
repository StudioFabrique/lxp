import Group from "../../utils/interfaces/db/group";
import User from "../../utils/interfaces/db/user";

export default async function deleteUserFromGroup(
  groupId: string,
  userId: string
) {
  try {
    const group = await Group.updateOne(
      {
        _id: groupId,
      },
      { $pull: { users: userId } }
    );

    await User.updateMany({ group: groupId }, { $pull: { group: groupId } });

    return group ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
}
