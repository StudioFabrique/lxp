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
    throw {
      message: "Aucun utilisateur trouvé avec les ID fournis.",
      statusCode: 404,
    };
  }

  let roles = await Role.find({ _id: rolesId });
  {
    if (!roles || roles.length === 0) {
      throw {
        message: "Aucun rôle trouvé avec les ID fournis.",
        statusCode: 404,
      };
    }
  }

  //  on vérifie que les étuduants à modifier existent bien
  if (actualUsers.length !== usersToUpdate.length) {
    throw {
      message: "Un ou plusieurs utilisateurs n'existent pas.",
      statusCode: 404,
    };
  }

  // on vérifie que les roles qu'on veut attribuer aux étudiants soient bien attribuables
  for (let i = 0; i < usersToUpdate.length; i++) {
    for (const role of roles) {
      if (role.rank > 2 && actualUsers[i].roles[0].rank <= 2) {
        throw {
          message:
            "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.",
          statusCode: 400,
        };
      } else if (role.rank <= 2 && actualUsers[i].roles[0].rank > 2) {
        throw {
          message:
            "Un ou plusieurs utilisateurs ne peuvent pas être mis à jour.",
          statusCode: 400,
        };
      }
    }
  }

  for (const actualUser of actualUsers) {
    console.log("ACTUAL USER ROLES", actualUser.roles);
  }

  //  on met les rôles des apprenants à jour
  const bulkUpdate = usersToUpdate.map((student: string) => {
    return {
      updateOne: {
        filter: {
          _id: student,
        },
        update: {
          roles,
        },
      },
    };
  });

  const updatedUsers = await User.bulkWrite(bulkUpdate);

  return updatedUsers;
}

export default updateUserRoles;
