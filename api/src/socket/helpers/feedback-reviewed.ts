import { Socket } from "socket.io";
import getConnectedStudent from "../db/get-connected-student";
import updateFeedback from "../db/update-feedback";

export async function feedbackReviewed(
  io: any,
  socket: Socket,
  studentId: string,
  feedbackId: any
) {
  {
    const result = await updateFeedback(feedbackId, socket.id);
    if (!result) return;
    const socketId = await getConnectedStudent(studentId);
    if (socketId) {
      const sock = io.sockets.sockets.get(socketId);
      if (sock) {
        sock.emit("feedback-reviewed");
      }
    }
    socket.emit("response-feedback-reviewed", feedbackId);
    console.log("response emitted !");
  }
}
