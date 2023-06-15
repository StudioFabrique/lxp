import Group from "../../utils/interfaces/db/group";
import User from "../../utils/interfaces/db/user.model";

async function getUsersStats() {
  const totalUsers = await User.count({});
  const totalDiplomed = await User.count({ degree: true });
  const totalActive = await User.count({ active: true });
  const totalAwol = await User.count({ awol: true });
  const totalGroups = await Group.count({});

  return {
    totalUsers,
    totalDiplomed,
    totalActive,
    totalAwol,
    totalGroups,
  };
}

export default getUsersStats;
