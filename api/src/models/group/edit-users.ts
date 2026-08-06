import Group from "../../utils/interfaces/db/group.ts";
import { type IUser } from "../../utils/interfaces/db/user.ts";

export default async function editUsers(groupId: string, users: IUser[]) {
  const ids = users.map((user) => user._id);

  try {
    const group = await Group.findOneAndUpdate(
      { id: groupId },
      { $set: { users: ids } },
      { new: true },
    );

    return group;
  } catch (error) {
    return null;
  }
}
