import { ObjectId } from "mongoose";
import Link, { ILink } from "../../utils/interfaces/db/link";
import User from "../../utils/interfaces/db/user";

export default async function editManyLinks(userId: ObjectId, links: ILink[]) {
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
            { new: true, upsert: true },
          );
          return updatedLink;
        } else {
          // If no _id, create a new link
          const newLink = new Link({
            ...item,
            user: user,
          });
          return await newLink.save();
        }
      }),
    );

    const updatedUser = await User.findByIdAndUpdate(
      user,
      { links: linkDocs.map((item) => item._id) },
      { new: true },
    );

    return updatedUser;
  } catch (error) {
    console.error("Error replacing or updating user links:", error);
    throw error;
  }
}
