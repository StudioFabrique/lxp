import Group from "../../utils/interfaces/db/group";
import User from "../../utils/interfaces/db/user";

export default async function addUsers(groupId: string, usersId: string[]) {
  try {
    const group = await Group.updateOne(
      { _id: groupId },
      { $push: { users: { $each: usersId } } }
    );

    await User.updateMany({ id: { usersId } }, { $push: { group: groupId } });

    return group;
  } catch (e) {
    console.log(e);
    return;
  }
}
