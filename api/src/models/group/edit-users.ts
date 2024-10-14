import Group from "../../utils/interfaces/db/group";
import { IUser } from "../../utils/interfaces/db/user";

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
