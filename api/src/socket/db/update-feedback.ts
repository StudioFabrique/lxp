import StudentFeedback from "../../utils/interfaces/db/student-feedback.ts";
import User from "../../utils/interfaces/db/user.ts";
import UserSocket from "../../utils/interfaces/db/user-socket.ts";

export default async function updateFeedback(
  feedbackId: string,
  studentId: string,
  socketId: string,
  message?: string,
) {
  const existingSocket = await UserSocket.findOne({ socketId });
  if (!existingSocket) return false;
  const existingTeacher = await User.findById(existingSocket?.userId);
  if (!existingTeacher) return false;

  const existingFeedback = await StudentFeedback.findOneAndUpdate(
    { _id: feedbackId, user: studentId, hasBeenReviewed: false },
    {
      hasBeenReviewed: true,
      teacher: existingTeacher,
      reviewMessage: message,
    },
    { returnDocument: "after" },
  );

  return existingFeedback !== null;
}
