import Group from "../../utils/interfaces/db/group.ts";
import User from "../../utils/interfaces/db/user.ts";
import { Types } from "mongoose";

export default async function addUsers(groupId: string, usersId: string[]) {
  try {
    const groupObjectId = new Types.ObjectId(groupId);
    const userObjectIds = usersId.map((id) => new Types.ObjectId(id));
    const group = await Group.updateOne(
      { _id: groupObjectId },
      { $addToSet: { users: { $each: userObjectIds } } },
    );

    await User.updateMany(
      { _id: { $in: userObjectIds } },
      { $addToSet: { group: groupObjectId } },
    );

    return group;
  } catch (e) {
    return;
  }
}
