import PromptStats from "../../utils/interfaces/db/prompt-stats.ts";

export default async function getTopFiveUsers(
  perPage = 2,
  page = 1,
  sortBy = "totalTokens",
  direction = "desc",
  searchTerm = "",
) {
  const skip = (page - 1) * perPage;

  const sortFieldMap: Record<string, string> = {
    totalTokens: "totalTokens",
    lastname: "lastname",
    role: "role",
    groupName: "groupName",
  };

  const sortField = sortFieldMap[sortBy] ?? "totalTokens";
  const sortDirection = direction === "desc" ? -1 : 1;

  const result = await PromptStats.aggregate([
    {
      $group: {
        _id: { userId: "$userId", groupId: "$groupId" },
        totalTokens: { $sum: "$tokensUsed" },
        lastActivity: { $max: "$createdAt" },
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
    { $match: { "userInfo.isActive": true } },
    {
      $addFields: {
        firstRoleId: { $arrayElemAt: ["$userInfo.roles", 0] },
      },
    },
    {
      $lookup: {
        from: "roles",
        localField: "firstRoleId",
        foreignField: "_id",
        as: "roleInfo",
      },
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
        firstname: "$userInfo.firstname",
        lastname: "$userInfo.lastname",
        name: { $concat: ["$userInfo.firstname", " ", "$userInfo.lastname"] },
        role: { $arrayElemAt: ["$roleInfo.role", 0] },
        roleRank: { $arrayElemAt: ["$roleInfo.rank", 0] },
        groupName: {
          $cond: [
            { $gt: [{ $size: "$groupInfo" }, 0] },
            { $arrayElemAt: ["$groupInfo.name", 0] },
            null,
          ],
        },
      },
    },
    ...(searchTerm
      ? [{ $match: { lastname: { $regex: searchTerm, $options: "i" } } }]
      : []),
    {
      $facet: {
        list: [
          { $sort: { [sortField]: sortDirection } },
          { $skip: skip },
          { $limit: perPage },
        ],
        total: [{ $count: "total" }],
      },
    },
  ]);

  const facet = result[0]; // $facet retourne toujours un tableau d'un élément

  return {
    list: facet.list.map((user: any) => ({
      _id: user._id.userId,
      name: user.name,
      firstname: user.firstname,
      lastname: user.lastname,
      totalTokens: user.totalTokens,
      groupName: user.groupName,
      lastActivity: user.lastActivity.toLocaleDateString(),
      role: user.role,
    })),
    total: facet.total[0]?.total ?? 0,
  };
}
