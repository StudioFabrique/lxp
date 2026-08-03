import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import Role from "../../utils/interfaces/db/role.ts";
import { sendUpdatedUserEmail } from "../../services/mailer.ts";

export default async function editUser(userId: string, user: IUser) {
  // Vérifier si l'utilisateur existe
  const userToUpdate = await User.findOne({ _id: userId }).populate("roles");
  if (!userToUpdate) {
    throw {
      statusCode: 404,
      message: "Utilisateur non trouvé.",
    };
  }

  // Mettre à jour l'utilisateur dans MongoDB
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      email: user.email.toLowerCase(),
      firstname: user.firstname.toLowerCase(),
      lastname: user.lastname.toLowerCase(),
      nickname: user.nickname?.toLowerCase(),
      description: user.description?.toLowerCase(),
      address: user.address?.toLowerCase(),
      city: user.city?.toLowerCase(),
      postCode: user.postCode?.toLowerCase(),
      birthDate: user.birthDate,
      phoneNumber: user.phoneNumber?.toLowerCase(),
      avatar: user.avatar,
    },
    { new: true }
  );

  await sendUpdatedUserEmail(userToUpdate.email);

  // Retourner l'utilisateur mis à jour et le rang du rôle
  return { updatedUser };
}
