import Hobby from "../../../utils/interfaces/db/hobby.ts";
import User from "../../../utils/interfaces/db/user.ts";

export default async function createHobby(userId: string, title: string) {
  const user = await User.findById(userId);

  if (!user) throw { statusCode: 404, message: "Utilisateur introuvable." };

  const hobby = await Hobby.create({ user: user._id, title });

  await user.updateOne({ $push: { hobbies: hobby._id } });

  return hobby;
}
