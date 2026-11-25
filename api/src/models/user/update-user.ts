import mongoose from "mongoose";
import User, { type IUser } from "../../utils/interfaces/db/user.ts";
import Link, { type ILink } from "../../utils/interfaces/db/link.ts";
import Hobby, { type IHobby } from "../../utils/interfaces/db/hobby.ts";

export type UserProfileInput = Omit<
  Partial<IUser>,
  "_id" | "links" | "hobbies" | "email"
> & {
  _id?: mongoose.Types.ObjectId | string;
  email: string;
  links?: Array<string | mongoose.Types.ObjectId | Partial<ILink>>;
  hobbies?: Array<string | mongoose.Types.ObjectId | Partial<IHobby>>;
};

type LinkInput = NonNullable<UserProfileInput["links"]>[number];
type HobbyInput = NonNullable<UserProfileInput["hobbies"]>[number];

function cleanLinkUrl(url: string): string {
  return url
    .replaceAll("&#x2F;", "/")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

async function resolveLinkId(
  link: LinkInput,
  userId: string,
): Promise<mongoose.Types.ObjectId | null> {
  if (!link) return null;
  if (typeof link === "string" || link instanceof mongoose.Types.ObjectId) {
    return new mongoose.Types.ObjectId(link);
  }
  if (!link.url) return null;

  const cleanedUrl = cleanLinkUrl(link.url);
  const existing = await Link.findOne({ url: cleanedUrl, user: userId });
  if (existing) return existing._id;

  delete link._id;
  const newLink = await Link.create({
    ...link,
    url: cleanedUrl,
    user: userId,
  });
  return newLink._id;
}

async function resolveLinkIds(
  links: LinkInput[],
  userId: string,
): Promise<mongoose.Types.ObjectId[]> {
  const linkIds: mongoose.Types.ObjectId[] = [];
  for (const link of links) {
    const id = await resolveLinkId(link, userId);
    if (id) linkIds.push(id);
  }
  return linkIds;
}

async function resolveHobbyId(
  hobby: HobbyInput,
  userId: string,
): Promise<mongoose.Types.ObjectId | null> {
  if (!hobby) return null;
  if (typeof hobby === "string" || hobby instanceof mongoose.Types.ObjectId) {
    return new mongoose.Types.ObjectId(hobby);
  }
  if (!hobby.title) return null;

  const existing = await Hobby.findOne({ title: hobby.title, user: userId });
  if (existing) return existing._id;

  delete hobby._id;
  const newHobby = await Hobby.create({ ...hobby, user: userId });
  return newHobby._id;
}

async function resolveHobbyIds(
  hobbies: HobbyInput[],
  userId: string,
): Promise<mongoose.Types.ObjectId[]> {
  const hobbyIds: mongoose.Types.ObjectId[] = [];
  for (const hobby of hobbies) {
    const id = await resolveHobbyId(hobby, userId);
    if (id) hobbyIds.push(id);
  }
  return hobbyIds;
}

export default async function updateUser(_id: string, user: UserProfileInput) {
  const existingUser = await User.findOne({ _id }).populate("roles");

  if (!existingUser)
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };

  const {
    _id: _ignoredId,
    email,
    password,
    graduations,
    roles,
    group,
    ...userDataSecure
  } = user;

  const linkIds = Array.isArray(userDataSecure.links)
    ? await resolveLinkIds(userDataSecure.links, _id)
    : // if links is not provided at all, keep existing
      existingUser.links || [];

  const hobbyIds = Array.isArray(userDataSecure.hobbies)
    ? await resolveHobbyIds(userDataSecure.hobbies, _id)
    : // if hobbies is not provided at all, keep existing
      existingUser.hobbies || [];

  const userUpdatePayload: Partial<IUser> = {
    ...userDataSecure,
    links: linkIds,
    hobbies: hobbyIds,
  };

  const userUpdated = await User.findOneAndUpdate({ _id }, userUpdatePayload, {
    returnDocument: "after",
  })
    .populate("links")
    .populate("hobbies")
    .populate("roles");

  return userUpdated ?? null;
}
