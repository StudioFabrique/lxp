import Group from "../../utils/interfaces/db/group";
import User from "../../utils/interfaces/db/user";

async function getUsersStats() {
  const totalUsers = await User.count({});
  const totalDiplomed = await User.count({ degree: true });
  const totalActive = await User.count({ isActive: true });
  const totalAwol = await User.count({ awol: true });
  const totalGroups = await Group.count({});

  return [
    {
      stat: "Total Utilisateurs",
      value: totalUsers,
    },
    {
      stat: "Total Diplômés",
      value: totalDiplomed,
    },
    {
      stat: "Total Actifs",
      value: totalActive,
    },
    {
      stat: "Total Groupes",
      value: totalGroups,
    },
    {
      stat: "Total Absences",
      value: totalAwol,
    },
  ];
}

export default getUsersStats;
