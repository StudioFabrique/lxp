import Graduation, { IGraduation } from "../../utils/interfaces/db/graduation";

export default async function createManyGraduations(
  userId: string,
  graduations: IGraduation[]
) {
  const graduationsUpdatedWithUserId = graduations.map((graduation) => {
    return { ...graduation, user: userId };
  });
  Graduation.insertMany(graduationsUpdatedWithUserId);
}
