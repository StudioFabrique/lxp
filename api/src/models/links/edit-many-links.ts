import Link, { type ILink } from "../../utils/interfaces/db/link.ts";
import User from "../../utils/interfaces/db/user.ts";
import { logger } from "../../utils/logs/logger.ts";

export default async function editManyLinks(userId: string, links: ILink[]) {
  try {
    const user = await User.findById(userId);

    const linkDocs = await Promise.all(
      links.map(async (item) => {
        delete item.id;

        if (item._id) {
          // If the link has an _id, attempt to update it
          const updatedLink = await Link.findByIdAndUpdate(
            item._id,
            { ...item },
            { returnDocument: "after", upsert: true },
          );
          return updatedLink;
        } else {
          // If no _id, create a new link
          const newLink = new Link({
            ...item,
            user: userId,
          });
          return await newLink.save();
        }
      }),
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { links: linkDocs.map((item) => item._id) },
      { returnDocument: "after" },
    );

    return updatedUser;
  } catch (error) {
    logger.error("Error replacing or updating user links:", error);
    throw error;
  }
}
