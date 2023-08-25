import Hobby, { IHobby } from "../../utils/interfaces/db/hobby";

export default async function createManyHobbies(
  userId: string,
  hobbies: IHobby[]
) {
  const hobbiesUpdatedWithUserId = hobbies.map((hobby) => {
    return { ...hobby, user: userId };
  });
  Hobby.insertMany(hobbiesUpdatedWithUserId);
}
