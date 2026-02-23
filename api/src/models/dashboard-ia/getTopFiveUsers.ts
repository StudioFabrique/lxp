import { group } from "node:console";
import PromptStats from "../../utils/interfaces/db/prompt-stats";

export default async function getTopFiveUsers() {
  const topUsers = await PromptStats.aggregate([
    {
      $group: {
        _id: {
          userId: "$userId",
          groupId: "$groupId",
        },
        totalTokens: { $sum: "$tokensUsed" },
      },
    },
    {
      $addFields: {
        userObjectId: { $toObjectId: "$_id.userId" },
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
    { $sort: { totalTokens: -1 } },
    { $limit: 5 },
  ]);

  return topUsers.map((user) => ({
    _id: user._id.userId,
    name: user.name,
    totalTokens: user.totalTokens,
    //groupName: user.groupName,
  }));
}
