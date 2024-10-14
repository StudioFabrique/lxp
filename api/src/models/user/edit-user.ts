import User, { IUser } from "../../utils/interfaces/db/user";
import { prisma } from "../../utils/db";
import Role from "../../utils/interfaces/db/role";

export default async function editUser(user: IUser, roleId: string) {
  try {
    // Vérifier si l'utilisateur existe
    const userToUpdate = await User.findOne({ _id: user._id });
    if (!userToUpdate) {
      throw {
        statusCode: 404,
        message: "Utilisateur non trouvé.",
      };
    }

    // Vérifier si le rôle existe
    const newRole = await Role.findOne({ _id: roleId });
    if (!newRole) {
      throw { statusCode: 404, message: "Le rôle n'existe pas." };
    }

    // Mettre à jour l'utilisateur dans MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        email: user.email.toLowerCase(),
        firstname: user.firstname.toLowerCase(),
        lastname: user.lastname.toLowerCase(),
        nickname: user.nickname?.toLowerCase(),
        description: user.description?.toLowerCase(),
        address: user.address?.toLowerCase(),
        city: user.city?.toLowerCase(),
        postCode: user.postCode?.toLowerCase(),
        phoneNumber: user.phoneNumber?.toLowerCase(),
        avatar: user.avatar,
        roles: newRole,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw {
        statusCode: 404,
        message: "Impossible de mettre à jour l'utilisateur.",
      };
    }

    // Retourner l'utilisateur mis à jour et le rang du rôle
    return { updatedUser, role: newRole.rank };
  } catch (error) {
    // Gérer les erreurs en les relayant
    throw error;
  }
}
