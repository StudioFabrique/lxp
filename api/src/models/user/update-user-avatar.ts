import User from "../../utils/interfaces/db/user";

export default function updateUserAvatar(userId: string | undefined, avatar: Buffer) {
  return User.updateOne({ _id: userId }, { avatar });
}
