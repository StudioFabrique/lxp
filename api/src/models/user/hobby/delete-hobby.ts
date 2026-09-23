import Hobby from "../../../utils/interfaces/db/hobby.ts";
import User from "../../../utils/interfaces/db/user.ts";

export default async function DeleteHobby(id: string, userId: string) {
  const hobby = await Hobby.findOneAndDelete({ _id: id, user: userId });
  if (!hobby) return false;
  await User.updateOne({ _id: userId }, { $pull: { hobbies: hobby._id } });
  return true;
}
