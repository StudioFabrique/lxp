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

      if (typeof link === "string" || link instanceof mongoose.Types.ObjectId) {
        linkIds.push(new mongoose.Types.ObjectId(link));
      } else if (link.url) {
        const cleanedUrl = link.url
          .replace(/&#x2F;/g, "/")
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        const existing = await Link.findOne({ url: cleanedUrl, user: _id });
        if (existing) {
          linkIds.push(existing._id);
        } else {
          delete link._id;
          const newLink = await Link.create({
            ...link,
            url: cleanedUrl,
            user: _id,
          });
          linkIds.push(newLink._id);
        }
      }
    }
  } else {
    // if links is not provided at all, keep existing
    linkIds = existingUser.links || [];
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
          delete hobby._id;
          const newHobby = await Hobby.create({ ...hobby, user: _id });
          hobbyIds.push(newHobby._id);
        }
      }
    }
  } else {
    // if hobbies is not provided at all, keep existing
    hobbyIds = existingUser.hobbies || [];
  }

  const userUpdatePayload: Partial<IUser> = {
    ...userDataSecure,
    links: linkIds,
    hobbies: hobbyIds,
  };

  const userUpdated = await User.findOneAndUpdate({ _id }, userUpdatePayload, {
    new: true,
  })
    .populate("links")
    .populate("hobbies")
    .populate("roles");

  return userUpdated ?? null;
}
