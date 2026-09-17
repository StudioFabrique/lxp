import Link from "../../../utils/interfaces/db/link.ts";
import User from "../../../utils/interfaces/db/user.ts";

export default async function createSocialNetwork(userId: string, url: string) {
  const user = await User.findById(userId);

  if (!user) throw { statusCode: 404, message: "Utilisateur introuvable." };

  const socialNetwork = await Link.create({ user: user._id, url });

  await user.updateOne({ $push: { links: socialNetwork._id } });

  return socialNetwork;
}
