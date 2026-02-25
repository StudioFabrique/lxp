import { totalmem } from "os";
import getStartAndEndOfMonth from "../../helpers/getStartAndEndOfMonth";
import PromptStats from "../../utils/interfaces/db/prompt-stats";

export default async function getTopFiveUsers(
  perPage = 2,
  page = 1,
  sortBy: string,
  direction: string,
) {
  const skip = (page - 1) * perPage;

  console.log("SKIP", skip);
  console.log("per page", perPage);

  const [topUsers, total] = await Promise.all([
    PromptStats.aggregate([
      {
        $group: {
          _id: {
            userId: "$userId",
            groupId: "$groupId",
          },
          totalTokens: { $sum: "$tokensUsed" },
          lastActivity: { $max: "$createdAt" },
        },
      },
      {
        $addFields: {
          userObjectId: {
            $toObjectId: "$_id.userId",
          },
          groupObjectId: {
            $cond: [
              { $ifNull: ["$_id.groupId", false] },
              { $toObjectId: "$_id.groupId" },
              null,
            ],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userObjectId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $addFields: {
          firstRoleId: { $arrayElemAt: ["$userInfo.roles", 0] },
        },
      },

      // 2. Lookup sur la collection "roles"
      {
        $lookup: {
          from: "roles",
          localField: "firstRoleId",
          foreignField: "_id",
          as: "roleInfo",
        },
      },

      // 3. Extrait le champ "role" (la string)
      {
        $addFields: {
          role: { $arrayElemAt: ["$roleInfo.role", 0] },
        },
      },
      {
        $match: { "userInfo.isActive": true },
      },
      {
        $lookup: {
          from: "groups",
          localField: "groupObjectId",
          foreignField: "_id",
          as: "groupInfo",
        },
      },
      {
        $addFields: {
          name: {
            $concat: ["$userInfo.firstname", " ", "$userInfo.lastname"],
          },
          groupName: {
            $cond: [
              { $gt: [{ $size: "$groupInfo" }, 0] },
              { $arrayElemAt: ["$groupInfo.name", 0] },
              null,
            ],
          },
        },
      },
      { $sort: { totalTokens: direction === "desc" ? -1 : 1 } },
      { $skip: skip },
      { $limit: perPage },
    ]),

    // Compte le nombre total d'utilisateurs distincts pour la pagination
    PromptStats.aggregate([
      {
        $group: {
          _id: "$userId",
        },
      },
      { $count: "total" },
    ]),
  ]);

  return {
    list: topUsers.map((user) => ({
      _id: user._id.userId,
      name: user.name,
      totalTokens: user.totalTokens,
      groupName: user.groupName,
      lastActivity: user.lastActivity.toLocaleDateString(),
      role: user.role,
    })),
    total: total[0]?.total ?? 0,
  };
}
