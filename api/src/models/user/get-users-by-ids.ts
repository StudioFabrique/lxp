import mongoose from "mongoose";
import User from "../../utils/interfaces/db/user.ts";
import Role from "../../utils/interfaces/db/role.ts";

export default async function getUsersByIds(
  userIds: string[],
  actorRank: number,
) {
  const hiddenRoles = await Role.find(
    { rank: { $lte: actorRank } },
    { _id: 1 },
  );
  const users = await User.find(
    {
      _id: {
        $in: userIds.map((userId) => new mongoose.Types.ObjectId(userId)),
      },
      roles: { $nin: hiddenRoles.map(({ _id }) => _id) },
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
