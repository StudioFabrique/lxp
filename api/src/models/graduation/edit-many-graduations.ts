import { ObjectId } from "mongoose";
import Graduation, { IGraduation } from "../../utils/interfaces/db/graduation";
import User from "../../utils/interfaces/db/user";

export default async function editManyGraduations(
  userId: ObjectId,
  graduations: IGraduation[],
) {
  try {
    const user = await User.findById(userId);

    const graduationDocs = await Promise.all(
      graduations.map(async (item) => {
        delete item.id;
        console.log({ gradItem: item });
        if (item._id) {
          // If the graduation has an _id, attempt to update it
          const updatedGraduation = await Graduation.findByIdAndUpdate(
            item._id,
            { ...item },
            { new: true, upsert: true },
          );
          return updatedGraduation;
        } else {
          // If no _id, create a new graduation
          const newGraduation = new Graduation({
            ...item,
            user: user,
          });
          return await newGraduation.save();
        }
      }),
    );

    const updatedUser = await User.findByIdAndUpdate(
      user,
      { graduations: graduationDocs.map((item) => item._id) },
      { new: true },
    );

    return updatedUser;
  } catch (error) {
    console.error("Error replacing or updating user graduations:", error);
    throw error;
  }
}
