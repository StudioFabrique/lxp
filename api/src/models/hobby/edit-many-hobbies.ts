import Hobby, { IHobby } from "../../utils/interfaces/db/hobby";
import User from "../../utils/interfaces/db/user";

export default async function editManyHobbies(
  userId: string,
  hobbies: IHobby[],
) {
  const hobbyUpdates = hobbies.map((hobby) => ({
    updateOne: {
      filter: { _id: hobby.id, user: userId },
      update: { $set: hobby },
      upsert: true,
    },
  }));

  const result = await Hobby.bulkWrite(hobbyUpdates);

  const updatedHobbyIds = Object.values(result.upsertedIds).map((id) => id._id);
  const existingHobbyIds = hobbies
    .filter((hobby) => hobby.id)
    .map((hobby) => hobby.id);

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      hobbies: {
        $each: [...updatedHobbyIds, ...existingHobbyIds],
      },
    },
  });
}
