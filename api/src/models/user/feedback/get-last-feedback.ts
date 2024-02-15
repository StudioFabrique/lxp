import StudentFeedback from "../../../utils/interfaces/db/student-feedback";

export default async function getLastFeedback(studentMdbId: string) {
  const lastFeedback = await StudentFeedback.findOne({
    user: studentMdbId,
  }).sort("-feedbackAt");

  return lastFeedback;
}
