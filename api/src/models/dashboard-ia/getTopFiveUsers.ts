import PromptStats from "../../utils/interfaces/db/prompt-stats";

export default async function getTopFiveUsers() {
  const topUsers = await PromptStats.aggregate([
    {
      $group: {
        _id: "$userId",
        totalTokens: { $sum: "$tokensUsed" },
      },
    },
    { $sort: { totalTokens: -1 } },
    { $limit: 5 },
  ]);
  return topUsers;
}
