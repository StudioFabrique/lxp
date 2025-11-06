import mongoose from "mongoose";
import User, { IUser } from "../../utils/interfaces/db/user";
import Link from "../../utils/interfaces/db/link";
import Hobby from "../../utils/interfaces/db/hobby";

export default async function updateUser(_id: string, user: IUser) {
  const existingUser = await User.findOne({ _id }).populate("roles");

  if (!existingUser)
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };

  delete user._id;
  const { email, password, graduations, roles, group, ...userDataSecure } =
    user;

  // Handle Links
  let linkIds: mongoose.Types.ObjectId[] = [];
  if (Array.isArray(userDataSecure.links)) {
    for (const link of userDataSecure.links) {
      if (!link) continue;

      // Existing ObjectId or string
      if (typeof link === "string" || link instanceof mongoose.Types.ObjectId) {
        linkIds.push(new mongoose.Types.ObjectId(link));
      }
      // Object with URL
      else if (link.url) {
        // check if this link already exists for this user (avoid duplicate creation)
        const existing = await Link.findOne({ url: link.url, user: _id });
        if (existing) {
          linkIds.push(existing._id);
        } else {
          // 👇 exclude _id if passed
          const { _id: _ignored, ...linkData } = link;
          const newLink = await Link.create({ ...linkData, user: _id });
          linkIds.push(newLink._id);
        }
      }
    }
  }

  // Handle Hobbies
  let hobbyIds: mongoose.Types.ObjectId[] = [];
  if (Array.isArray(userDataSecure.hobbies)) {
    for (const hobby of userDataSecure.hobbies) {
      if (!hobby) continue;

      if (
        typeof hobby === "string" ||
        hobby instanceof mongoose.Types.ObjectId
      ) {
        hobbyIds.push(new mongoose.Types.ObjectId(hobby));
      } else if (hobby.title) {
        const existing = await Hobby.findOne({ title: hobby.title, user: _id });
        if (existing) {
          hobbyIds.push(existing._id);
        } else {
          const { _id: _ignored, ...hobbyData } = hobby;
          const newHobby = await Hobby.create({ ...hobbyData, user: _id });
          hobbyIds.push(newHobby._id);
        }
      }
    }
  }

  const userUpdatePayload: Partial<IUser> = {
    ...userDataSecure,
    links: linkIds.length > 0 ? linkIds : existingUser.links,
    hobbies: hobbyIds.length > 0 ? hobbyIds : existingUser.hobbies,
  };

  const userUpdated = await User.findOneAndUpdate({ _id }, userUpdatePayload, {
    new: true,
  })
    .populate("links")
    .populate("hobbies")
    .populate("roles");

  return userUpdated ?? null;
}
