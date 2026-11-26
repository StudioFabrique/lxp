import { compare, genSalt, hash } from "bcrypt";
import User from "../../utils/interfaces/db/user.ts";
import { notifyPasswordChanged } from "./notify-user-updated.ts";

export default async function updateUserPassword(
  _id: string,
  oldPass: string,
  newPass: string
) {
  const currentUserPassData = await User.findById(_id).select("password email");

  if (
    !currentUserPassData?.password ||
    !(await compare(oldPass, currentUserPassData?.password))
  ) {
    return null;
  }

  const password = await hash(newPass, await genSalt(10));

  const userUpdated = await User.updateOne({ _id }, { password });

  if (userUpdated) {
    notifyPasswordChanged(currentUserPassData.email);
    return userUpdated;
  }

  return null;
}
