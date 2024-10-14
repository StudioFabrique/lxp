import { hash } from "bcrypt";
import User from "../../utils/interfaces/db/user";
import mongoose from "mongoose";

export default async function putPassword(userId: string, password: string) {
  console.log("id", userId);
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas" };

  const hashedPassword = await hash(password, 10);
  const updatedUser = await User.updateOne(
    { _id: new mongoose.Types.ObjectId(userId) },
    { ...existingUser, password: hashedPassword },
  );
  return updatedUser;
}
