import Role from "../../utils/interfaces/db/role";
import User from "../../utils/interfaces/db/user";

async function updateUserRoles(
  usersToUpdate: Array<string>,
  rolesId: Array<string>
) {
  //  on récupère les roles avec les privilèges les plus élevés de chaques apprenant
  let actualUsers = await User.find({ _id: usersToUpdate }).populate("roles", {
    rank: 1,
  });

  if (!actualUsers) {
    return false;
  }

  let roles = await Role.find({ _id: rolesId });

  //  on vérifie que les étuduants à modifier existent bien
  if (actualUsers.length !== usersToUpdate.length) {
    console.log("probleme longueur");

    return false;
  }

  // on vérifie que les roles qu'on veut attribuer aux étudiants soient bien attribuables
  for (let i = 0; i < usersToUpdate.length; i++) {
    if (roles[0].rank !== actualUsers[i].roles[0].rank) {
      console.log("probleme rank");

      return false;
    }
  }

  //  on met les rôles des apprenants à jour
  const bulkUpdate = usersToUpdate.map((student: string) => {
    return {
      updateOne: {
        filter: {
          _id: student,
        },
        update: {
          roles: roles,
        },
      },
    };
  });

  const updatedUsers = await User.bulkWrite(bulkUpdate);

  return updatedUsers;
}

export default updateUserRoles;
