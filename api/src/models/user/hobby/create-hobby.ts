import Hobby from "../../../utils/interfaces/db/hobby.ts";
import User from "../../../utils/interfaces/db/user.ts";

export default async function createHobby(userId: string, title: string) {
  const user = await User.findById(userId);

  const hobby = await Hobby.create({ user, title });

  await user?.updateOne({ $push: { hobbies: hobby } });

  return hobby;
}
