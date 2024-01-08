import Graduation, { IGraduation } from "../../utils/interfaces/db/graduation";
import User from "../../utils/interfaces/db/user";

export default async function createManyGraduations(
  userId: string,
  graduations: IGraduation[]
) {
  const graduationsUpdatedWithUserId = graduations.map((graduation) => {
    delete graduation.id;
    return { ...graduation, user: userId };
  });

  const graduationsToAdd = await Graduation.insertMany(
    graduationsUpdatedWithUserId
  );

  await User.findByIdAndUpdate(userId, {
    $push: { graduations: graduationsToAdd },
  });
}
