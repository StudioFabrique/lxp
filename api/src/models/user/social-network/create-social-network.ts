import Link from "../../../utils/interfaces/db/link.ts";
import User from "../../../utils/interfaces/db/user.ts";

export default async function createSocialNetwork(userId: string, url: string) {
  const user = await User.findById(userId);

  const socialNetwork = await Link.create({ user, url });

  await user?.updateOne({ $push: { links: socialNetwork } });

  return socialNetwork;
}
