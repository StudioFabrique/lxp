import Group from "../../utils/interfaces/db/group.ts";
import User from "../../utils/interfaces/db/user.ts";

async function getUsersStats() {
  const totalUsers = await User.countDocuments({});
  const totalActive = await User.countDocuments({ isActive: false });
  const totalGroups = await Group.countDocuments({});

  return [
    {
      stat: "Total Utilisateurs",
      value: totalUsers,
    },
    {
      stat: "Total Inactifs",
      value: totalActive,
    },
    {
      stat: "Total Groupes",
      value: totalGroups,
    },
  ];
}

export default getUsersStats;
