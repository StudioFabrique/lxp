import StudentFeedback from "../../../utils/interfaces/db/student-feedback";
import User from "../../../utils/interfaces/db/user";
import getLastFeedback from "./get-last-feedback";

export default async function postFeedBack(
  studentMdbId: string,
  feelingLevel: number,
  comment?: string
) {
  const existingFeedback = await getLastFeedback(studentMdbId);

  // Check if a feedback has been sent within previous 24 hour
  if (
    existingFeedback &&
    Math.floor(
      (existingFeedback.feedbackAt.getTime() - new Date().getTime()) *
        2.77778e-7
    ) < 24
  ) {
    return null;
  }

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