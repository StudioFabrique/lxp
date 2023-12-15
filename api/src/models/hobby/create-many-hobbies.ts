import Hobby, { IHobby } from "../../utils/interfaces/db/hobby";
import User from "../../utils/interfaces/db/user";

export default async function createManyHobbies(
  userId: string,
  hobbies: IHobby[]
) {
  const hobbiesUpdatedWithUserId = hobbies.map((hobby) => {
    return { ...hobby, user: userId };
  });
  const hobbiesToAdd = await Hobby.insertMany(hobbiesUpdatedWithUserId);

  await User.findByIdAndUpdate(userId, {
    $push: { hobbies: hobbiesToAdd },
  });
}
