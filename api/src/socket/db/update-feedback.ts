import StudentFeedback from "../../utils/interfaces/db/student-feedback";
import User from "../../utils/interfaces/db/user";
import UserSocket from "../../utils/interfaces/db/user-socket";

export default async function updateFeedback(
  feedbackId: string,
  socketId: string
) {
  const existingSocket = await UserSocket.findOne({ socketId });
  if (!existingSocket) return false;
  const existingTeacher = await User.findById(existingSocket?.userId);
  if (!existingTeacher) return false;

  const existingFeedback = await StudentFeedback.findOneAndUpdate(
    { _id: feedbackId },
    {
      hasBeenReviewed: true,
      teacher: existingTeacher,
    },
    { new: true }
  );

  return true;
}
