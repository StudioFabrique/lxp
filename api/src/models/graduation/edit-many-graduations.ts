import Graduation, { IGraduation } from "../../utils/interfaces/db/graduation";
import User from "../../utils/interfaces/db/user";

export default async function editManyGraduations(
  userId: string,
  graduations: IGraduation[],
) {
  const graduationUpdates = graduations.map((graduation) => ({
    updateOne: {
      filter: { _id: graduation.id, user: userId },
      update: { $set: graduation },
      upsert: true,
    },
  }));

  const result = await Graduation.bulkWrite(graduationUpdates);

  const updatedGraduationIds = Object.values(result.upsertedIds).map(
    (id) => id._id,
  );
  const existingGraduationIds = graduations
    .filter((graduation) => graduation.id)
    .map((graduation) => graduation.id);

  await User.findByIdAndUpdate(userId, {
    $addToSet: {
      graduations: {
        $each: [...updatedGraduationIds, ...existingGraduationIds],
      },
    },
  });
}
