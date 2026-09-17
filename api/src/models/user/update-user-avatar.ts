import User from "../../utils/interfaces/db/user.ts";

export default function updateUserAvatar(userId: string | undefined, avatar: Buffer) {
  return User.updateOne({ _id: userId }, { avatar });
}

export function deleteUserAvatar(userId: string) {
  return User.updateOne({ _id: userId }, { $unset: { avatar: 1 } });
}
