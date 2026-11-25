import User from "../../utils/interfaces/db/user.ts";

/** Adresse e-mail d'un compte, ou `undefined` si absente. */
export async function getUserEmail(userId: string | undefined) {
  const user = await User.findById(userId).select("email").lean();
  return user?.email;
}
