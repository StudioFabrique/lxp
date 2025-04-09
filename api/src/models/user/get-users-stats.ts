import Group from "../../utils/interfaces/db/group";
import User from "../../utils/interfaces/db/user";

async function getUsersStats() {
  const totalUsers = await User.count({});
  const totalActive = await User.count({ isActive: false });
  const totalGroups = await Group.count({});

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
    } /*    {
      stat: "Total Diplômés",
      value: totalDiplomed,
    },
    {
      stat: "Total Actifs",
      value: totalActive,
    },*/,
  ];
}

export default getUsersStats;
