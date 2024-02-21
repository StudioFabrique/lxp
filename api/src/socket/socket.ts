import { Server, Socket } from "socket.io";
import connect from "./db/connect";
import disconnect from "./db/disconnect";
import countConnectedUser from "./db/count-connected-students";
import postFeedBack from "../models/user/feedback/post-feedback";
import felicitateStudent from "./db/felicitate-student";
import User from "../utils/interfaces/db/user";

export function socket(io: Server): void {
  io.on("connection", async (socket: Socket) => {
    const { userId } = socket.handshake.query as { userId: string };
    await connect(socket.id, userId);
    const count = await countConnectedUser();
    io.emit("students-count", count);
    console.log(`${userId} connected`);

    socket.on("disconnect", async () => {
      await disconnect(socket.id);
      console.log(`user with id: ${userId} is disconnected`);
      const count = await countConnectedUser();
      io.emit("students-count", count);
    });

    socket.on("students-count", async () => {
      const count = await countConnectedUser();
      io.emit("students-count", count);
    });

    socket.on("student-feedback", async ({ feelingLevel, comment }) => {
      await postFeedBack(userId, feelingLevel, comment);
    });

    socket.on(
      "receive-accomplishment",
      async ({ studentMdbIdToFelicitate, accomplishmentId, idMdbUserFrom }) => {
        const accomplishment = await felicitateStudent(
          studentMdbIdToFelicitate,
          accomplishmentId
        );

        if (accomplishment) {
          const userFrom = await User.findOne({ _id: idMdbUserFrom });
          const nameFrom = `${userFrom?.firstname} ${userFrom?.lastname}`;

          io.emit("send-accomplishment", {
            studentMdbIdToFelicitate,
            nameFrom,
          });
        }
      }
    );
  });
}
