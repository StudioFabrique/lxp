import Group from "../../utils/interfaces/db/group.ts";
import Role from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";

/**
 * Les compteurs portent sur les mêmes utilisateurs que la liste : ceux dont le
 * rôle est de rang strictement inférieur à celui de l'appelant. Sans ce filtre,
 * le root et les rangs supérieurs seraient comptés sans jamais être listés.
 */
async function getUsersStats(actorRank: number) {
  const hiddenRoles = await Role.find(
    { rank: { $lte: actorRank } },
    { _id: 1 },
  );
  const visibleUsersFilter = {
    roles: { $nin: hiddenRoles.map(({ _id }) => _id) },
  };

  const totalUsers = await User.countDocuments(visibleUsersFilter);
  const totalInactive = await User.countDocuments({
    ...visibleUsersFilter,
    isActive: false,
  });
  const totalGroups = await Group.countDocuments({});

  return [
    {
      stat: "Total Utilisateurs",
      value: totalUsers,
    },
    {
      stat: "Total Inactifs",
      value: totalInactive,
    },
    {
      stat: "Total Groupes",
      value: totalGroups,
    },
  ];
}

export default getUsersStats;
