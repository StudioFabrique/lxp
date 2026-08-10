import mongoose from "mongoose";
import User from "../../utils/interfaces/db/user.ts";

export default async function getUsersByIds(userIds: string[]) {
  const users = await User.find(
    {
      _id: {
        $in: userIds.map((userId) => new mongoose.Types.ObjectId(userId)),
      },
    },
    { password: 0 },
  )
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .lean();

  const usersById = new Map(
    users.map((user) => [user._id.toString(), user]),
  );
  return userIds.flatMap((userId) => {
    const user = usersById.get(userId);
    return user ? [user] : [];
  });
}
