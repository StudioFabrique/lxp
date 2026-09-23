import { Socket } from "socket.io";
import getConnectedStudent from "../db/get-connected-student.ts";
import updateFeedback from "../db/update-feedback.ts";

// met à jour le statut d'un feedback dans la bdd
export async function feedbackReviewed(
  io: any,
  socket: Socket,
  studentId: string,
  feedbackId: string,
  message?: string,
) {
  const reviewMessage = typeof message === "string" ? message.trim().slice(0, 1000) : "";
  const result = await updateFeedback(feedbackId, studentId, socket.id, reviewMessage || undefined);
  if (!result) return;
  const socketId = await getConnectedStudent(studentId);
  if (socketId) {
    const sock = io.sockets.sockets.get(socketId);
    if (sock) {
      sock.emit("feedback-reviewed");
    }
  }
  socket.emit("response-feedback-reviewed", feedbackId);
}
