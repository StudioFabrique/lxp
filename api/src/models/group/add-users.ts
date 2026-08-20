import Group from "../../utils/interfaces/db/group.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function addUsers(groupId: string, usersId: string[]) {
  try {
    const group = await Group.updateOne(
      { _id: groupId },
      { $push: { users: { $each: usersId } } }
    );

    await User.updateMany({ id: { usersId } }, { $push: { group: groupId } });

    return group;
  } catch (e) {
    return;
  }
}
