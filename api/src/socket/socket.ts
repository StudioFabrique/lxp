import { Server, Socket } from "socket.io";
import connect from "./db/connect";
import disconnect from "./db/disconnect";
import countConnectedUser from "./db/count-connected-students";

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
      console.log({ count });

      io.emit("students-count", count);
    });
  });
}
