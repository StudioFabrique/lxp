import Link, { ILink } from "../../utils/interfaces/db/link";
import User from "../../utils/interfaces/db/user";

export default async function editManyLinks(userId: string, links: ILink[]) {
  const linkUpdates = links.map((link) => ({
    updateOne: {
      filter: { _id: link.id, user: userId },
      update: { $set: link },
      upsert: true,
    },
  }));

  const result = await Link.bulkWrite(linkUpdates);

  const updatedLinkIds = Object.values(result.upsertedIds).map((id) => id._id);
  const existingLinkIds = links
    .filter((link) => link.id)
    .map((link) => link.id);

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      links: {
        $each: [...updatedLinkIds, ...existingLinkIds],
      },
    },
  });
}
