import { type ObjectId } from "mongoose";
import Hobby, { type IHobby } from "../../../utils/interfaces/db/hobby.ts";
import User from "../../../utils/interfaces/db/user.ts";
import { logger } from "../../../utils/logs/logger.ts";

export default async function editManyHobbies(
  userId: ObjectId,
  hobbies: IHobby[]
) {
  try {
    const user = await User.findById(userId);

    const hobbyDocs = await Promise.all(
      hobbies.map(async (item) => {
        delete item.id;

        if (item._id) {
          // If the hobby has an _id, attempt to update it
          const updatedHobby = await Hobby.findByIdAndUpdate(
            item._id,
            { ...item },
            { new: true, upsert: true }
          );
          return updatedHobby;
        } else {
          // If no _id, create a new hobby
          const newHobby = new Hobby({
            ...item,
            user: user,
          });
          return await newHobby.save();
        }
      })
    );

    const updatedUser = await User.findByIdAndUpdate(
      user,
      { hobbies: hobbyDocs.map((item) => item._id) },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    logger.error("Error replacing or updating user hobbies:", error);
    throw error;
  }
}
