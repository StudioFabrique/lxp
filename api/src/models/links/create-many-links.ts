import Link, { type ILink } from "../../utils/interfaces/db/link.ts";
import User from "../../utils/interfaces/db/user.ts";

export default async function createManyLinks(userId: string, links: ILink[]) {
  const linksUpdatedWithUserId = links.map((link) => {
    delete link.id;
    return { ...link, user: userId };
  });
  const linksToAdd = await Link.insertMany(linksUpdatedWithUserId);

  await User.findByIdAndUpdate(userId, {
    $push: { links: linksToAdd },
  });
}
