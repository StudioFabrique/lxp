import Graduation, { IGraduation } from "../../utils/interfaces/db/graduation";

export default async function createManyGraduations(
  userId: string,
  graduations: IGraduation[]
) {
  const graduationsUpdatedWithUserId = graduations.map((graduation) => {
    delete graduation.id;
    return { ...graduation, user: userId };
  });
  Graduation.insertMany(graduationsUpdatedWithUserId);
}
