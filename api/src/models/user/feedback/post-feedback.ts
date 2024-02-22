import StudentFeedback from "../../../utils/interfaces/db/student-feedback";
import User from "../../../utils/interfaces/db/user";
import getLastFeedback from "./get-own-feedback";

export default async function postFeedBack(
  studentMdbId: string,
  feelingLevel: number,
  comment?: string
) {
  const existingFeedback = await getLastFeedback(studentMdbId);

  const today = new Date();
  let feedbackDate: Date;
  if (existingFeedback && existingFeedback.feedbackAt) {
    feedbackDate = new Date(existingFeedback.feedbackAt);
    if (
      today.getDate() === feedbackDate.getDate() &&
      today.getMonth() === feedbackDate.getMonth() &&
      today.getFullYear() === feedbackDate.getFullYear()
      /*     Math.floor(
      (feedbackDate.getTime() - new Date().getTime()) *
        2.77778e-7
    ) < 24 */
    ) {
      return null;
    }
  }
  // vérification qu'un feedback n'ait pas été envoyé par l'apprenant à cette même date

  const feedback = await StudentFeedback.create({
    feelingLevel,
    comment,
    user: studentMdbId,
  });

  await User.findOneAndUpdate(
    { _id: studentMdbId },
    { $push: { studentFeedbacks: feedback } }
  );

  return feedback;
}
