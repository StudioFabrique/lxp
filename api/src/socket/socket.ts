import { Server, Socket } from "socket.io";
import connect from "./db/connect";
import disconnect from "./db/disconnect";
import countConnectedUser from "./db/count-connected-students";
import postFeedBack from "../models/user/feedback/post-feedback";
import getFeedbacks from "./db/get-connected-contacts";
import getUserData from "./db/get-user-data";

export function socket(io: Server): void {
  io.on("connection", async (socket: Socket) => {
    const { userId } = socket.handshake.query as { userId: string };
    await connect(socket.id, userId);
    const count = await countConnectedUser();
    io.emit("read:students-count", count);

    socket.on("disconnect", async () => {
      await disconnect(socket.id);
      const count = await countConnectedUser();
      io.emit("read:students-count", count);
    });

    socket.on("read:students-count", async () => {
      const count = await countConnectedUser();
      io.emit("read:students-count", count);
    });

    socket.on(
      "write:receive-student-feedback",
      async ({ feelingLevel, comment }) => {
        const result = await postFeedBack(userId, feelingLevel, comment);
        const contactsList = await getFeedbacks(userId);
        const userData = await getUserData(userId);

        if (result) {
          const feedback = {
            _id: result._id,
            feedbackAt: result.feedbackAt,
            comment: result.comment,
            feelingLevel: result.feelingLevel,
            name: `${userData.firstname} ${userData.lastname}`,
            avatar: userData.avatar,
          };
          for (const contact of contactsList) {
            const sock = io.sockets.sockets.get(contact.socketId);
            if (sock) {
              sock.emit("read:new-feedback-received", feedback);
            } else {
              console.error(`Socket non trouvé pour l'ID : ${contact}`);
            }
          }
        }
      }
    );
  });
}
