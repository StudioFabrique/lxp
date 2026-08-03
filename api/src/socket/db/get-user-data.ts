import User from "../../utils/interfaces/db/user.ts";

export default async function getUserData(userId: string) {
  const userData = await User.findOne(
    { _id: userId },
    { avatar: 1, firstname: 1, lastname: 1 }
  );

  if (!userData) {
    throw { message: "L'utilisateur n'existe pas...", statusCode: 404 };
  }

  return userData;
}
