import Group from "../../utils/interfaces/db/group";

export default async function addUsers(groupId: string, usersId: string[]) {
  try {
    await Group.updateOne(
      { _id: groupId },
      { $push: { users: { $each: usersId } } }
    );
  } catch (e) {
    console.log(e);
    return;
  }
}
