import putAccomplishmentCompleted from "../../models/user/accomplishments/put-accomplishment-completed";

export default async function felicitateStudent(
  studentMdbId: string,
  accomplishmentId: number
) {
  const existingAccomplishment = await prisma?.accomplishment.findUnique({
    where: { id: accomplishmentId, student: { idMdb: studentMdbId } },
  });

  if (!existingAccomplishment || existingAccomplishment?.hasBeenCongratulated) {
    return;
  }

  const accomplishment = await putAccomplishmentCompleted(accomplishmentId);

  return accomplishment;
}
