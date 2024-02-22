import StudentFeedback from "../../utils/interfaces/db/student-feedback";

export default async function updateFeedback(feedbackId: string) {
  const existingFeedback = await StudentFeedback.findOneAndUpdate(
    { _id: feedbackId },
    {
      hasBeenReviewed: true,
    },
    { new: true }
  );
}
