import { Server, Socket } from "socket.io";
import connect from "./db/connect";
import disconnect from "./db/disconnect";
import countConnectedUser from "./db/count-connected-students";
import postFeedBack from "../models/user/feedback/post-feedback";
import congratulateStudent from "./db/congratulate-student";
import User from "../utils/interfaces/db/user";
import getUserGroupId from "./db/get-user-group-id";

export function socket(io: Server): void {
  io.on("connection", async (socket: Socket) => {
    const { userId } = socket.handshake.query as { userId: string };
    await connect(socket.id, userId);
    const count = await countConnectedUser();
    io.emit("students-count", count);
    console.log(`${userId} connected`);

    const groupId = await getUserGroupId(userId);
    console.log({ groupId });
    console.log({ userId });

    if (groupId) {
      if (!socket.rooms.has(groupId)) socket.rooms.add(groupId);
      socket.join(groupId);
      console.log(`room ${groupId} joined by ${userId}`);
    }

    socket.on("disconnect", async () => {
      await disconnect(socket.id);
      console.log(`user with id: ${userId} is disconnected`);
      const count = await countConnectedUser();
      io.emit("students-count", count);
    });

    socket.on("read:students-count", async () => {
      const count = await countConnectedUser();
      io.emit("students-count", count);
    });

    socket.on(
      "write:receive-student-feedback",
      async ({ feelingLevel, comment }) => {
        await postFeedBack(userId, feelingLevel, comment);
      }
    );

    socket.on(
      "write:receive-accomplishment",
      async ({ studentMdbIdToFelicitate, accomplishmentId, idMdbUserFrom }) => {
        const accomplishment = await congratulateStudent(
          studentMdbIdToFelicitate,
          accomplishmentId
        );

        if (accomplishment) {
          const userFrom = await User.findOne({ _id: idMdbUserFrom });
          const nameFrom = `${userFrom?.firstname} ${userFrom?.lastname}`;

          io.to(groupId).emit("read:send-accomplishment", {
            studentMdbIdToFelicitate,
            nameFrom,
          });
        }
      }
    );
  });
}
