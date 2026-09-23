import Link from "../../../utils/interfaces/db/link.ts";
import User from "../../../utils/interfaces/db/user.ts";

export default async function deleteSocialNetwork(id: string, userId: string) {
  const link = await Link.findOneAndDelete({ _id: id, user: userId });
  if (!link) return false;
  await User.updateOne({ _id: userId }, { $pull: { links: link._id } });
  return true;
}
