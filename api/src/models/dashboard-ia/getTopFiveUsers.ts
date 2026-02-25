import PromptStats from "../../utils/interfaces/db/prompt-stats";

export default async function getTopFiveUsers(
  perPage = 2,
  page = 1,
  sortBy = "totalTokens",
  direction = "desc",
) {
  const skip = (page - 1) * perPage;

  // Mapping des champs de tri
  const sortFieldMap: Record<string, string> = {
    totalTokens: "totalTokens",
    lastname: "lastname",
    role: "role",
    groupName: "groupName",
  };

  const sortField = sortFieldMap[sortBy] ?? "totalTokens";
  const sortDirection = direction === "desc" ? 1 : -1;

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
      // Récupère le premier rôle (ObjectId)
      {
        $addFields: {
          firstRoleId: { $arrayElemAt: ["$userInfo.roles", 0] },
        },
      },
      // Lookup roles
      {
        $lookup: {
          from: "roles",
          localField: "firstRoleId",
          foreignField: "_id",
          as: "roleInfo",
        },
      },
      // Lookup groups
      {
        $lookup: {
          from: "groups",
          localField: "groupObjectId",
          foreignField: "_id",
          as: "groupInfo",
        },
      },
      // Construit tous les champs finaux
      {
        $addFields: {
          firstname: "$userInfo.firstname", // ✅ pas un tableau, pas besoin de $arrayElemAt
          lastname: "$userInfo.lastname",
          name: {
            $concat: ["$userInfo.firstname", " ", "$userInfo.lastname"],
          },
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
      { $sort: { [sortField]: sortDirection } },
      { $skip: skip },
      { $limit: perPage },
    ]),
    PromptStats.aggregate([
      { $group: { _id: "$userId" } },
      { $count: "total" },
    ]),
  ]);

  return {
    list: topUsers.map((user) => ({
      _id: user._id.userId,
      name: user.name,
      firstname: user.firstname,
      lastname: user.lastname,
      totalTokens: user.totalTokens,
      groupName: user.groupName,
      lastActivity: user.lastActivity.toLocaleDateString(),
      role: user.role,
    })),
    total: total[0]?.total ?? 0,
  };
}
