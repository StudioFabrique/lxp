import { hash } from "bcrypt";
import User from "../../utils/interfaces/db/user";
import mongoose from "mongoose";

export default async function putPassword(userId: string, password: string) {
  const existingUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(userId),
  });

  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas" };

  const hashedPassword = await hash(password, 10);
  const updatedResult = await User.updateOne(
    { _id: existingUser._id },
    {
      $set: { password: hashedPassword, isActive: true, emailVerified: true },
    },
  );
  return updatedResult;
}
