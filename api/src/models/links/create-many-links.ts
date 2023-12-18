import Link, { ILink } from "../../utils/interfaces/db/link";
import User from "../../utils/interfaces/db/user";

export default async function createManyLinks(userId: string, links: ILink[]) {
  const linksUpdatedWithUserId = links.map((link) => {
    return { ...link, user: userId };
  });
  const linksToAdd = await Link.insertMany(linksUpdatedWithUserId);

  await User.findByIdAndUpdate(userId, {
    $push: { links: linksToAdd },
  });
}
