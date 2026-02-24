import PromptStats from "../../utils/interfaces/db/prompt-stats";

export default async function getAllGroupsStats() {
  const groupsStats = await PromptStats.aggregate([
    {
      $group: {
        _id: "$groupId",
        totalTokens: { $sum: "$tokensUsed" },
        /* totalPrompts: { $sum: 1 },
        averageTokensPerPrompt: { $avg: "$tokensUsed" },*/
      },
    },
    {
      // Convert string groupId to ObjectId for lookup
      $addFields: {
        groupObjectId: { $toObjectId: "$_id" },
      },
    },
    {
      // Join with groups collection to get group name
      $lookup: {
        from: "groups",
        localField: "groupObjectId",
        foreignField: "_id",
        as: "groupInfo",
      },
    },
    {
      // Flatten the groupInfo array and extract name
      $addFields: {
        groupName: { $arrayElemAt: ["$groupInfo.name", 0] },
      },
    },
    {
      // Remove temporary fields
      $project: {
        _id: 1,
        totalTokens: 1,
        totalPrompts: 1,
        averageTokensPerPrompt: 1,
        groupName: 1,
      },
    },
  ]);
  return groupsStats.map((g) => {
    if (g._id !== null) {
      return g;
    } else {
      return {
        _id: "admin",
        totalTokens: g.totalTokens,

        groupName: "Admins & Formateurs",
      };
    }
  });
}
