import getStartAndEndOfMonth from "../../helpers/getStartAndEndOfMonth";
import PromptStats from "../../utils/interfaces/db/prompt-stats";

/**
 * getAllGroupsStats
 *
 * Fetch aggregated token usage per group for the current month.
 *
 * Behaviour:
 * - Filters PromptStats by `createdAt` within the current month.
 * - Groups by `groupId` and sums `tokensUsed` to compute `totalTokens`.
 * - Converts the grouped `_id` (string) to an ObjectId to perform a lookup
 *   against the `groups` collection and retrieve group metadata.
 * - Filters out inactive groups (keeps only `isActive: true`).
 * - Projects the resulting fields: `_id`, `totalTokens`, and `groupName`.
 *
 * Notes & optimization suggestions (non-invasive):
 * - Applying the `$match` stage before `$group` and `$lookup` is good for performance
 *   because it reduces the working set early.
 * - Ensure there is an index on `createdAt` (and possibly `groupId`) for the `PromptStats`
 *   collection to make the initial `$match` efficient.
 * - If `groupId` is already stored as an ObjectId in `PromptStats`, the `$toObjectId`
 *   conversion can be removed which would be more efficient. Currently the pipeline
 *   assumes `_id` produced by `$group` is a string representing the ObjectId.
 */

export default async function getAllGroupsStats() {
  const { startOfMonth, endOfMonth } = getStartAndEndOfMonth();

  const groupsStats = await PromptStats.aggregate([
    {
      // Early filter by createdAt to limit documents processed by the pipeline.
      $match: {
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      // Group documents by groupId and sum tokensUsed for each group.
      $group: {
        _id: "$groupId",
        totalTokens: { $sum: "$tokensUsed" },
      },
    },
    {
      // Convert the grouped string `_id` into an ObjectId so we can join with `groups`.
      // If `groupId` is already an ObjectId in the source collection, this step is redundant.
      $addFields: {
        groupObjectId: { $toObjectId: "$_id" },
      },
    },
    {
      // Join with the `groups` collection to fetch group metadata (name, isActive, ...).
      $lookup: {
        from: "groups",
        localField: "groupObjectId",
        foreignField: "_id",
        as: "groupInfo",
      },
    },
    {
      // Extract useful fields from the joined array.
      // Use `$arrayElemAt` to safely pick the first matching element (or `null` if none).
      $addFields: {
        groupName: { $arrayElemAt: ["$groupInfo.name", 0] },
        groupIsActive: { $arrayElemAt: ["$groupInfo.isActive", 0] }, // extracts isActive flag
      },
    },
    {
      // After enriching with group info, filter out inactive groups.
      $match: {
        groupIsActive: true,
      },
    },
    {
      // Keep only the fields we need in the final output.
      $project: {
        _id: 1,
        totalTokens: 1,
        groupName: 1,
      },
    },
  ]);

  return groupsStats;
}
