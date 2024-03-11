import { Server, Socket } from "socket.io";
import connect from "./db/connect";
import disconnect from "./db/disconnect";
import countConnectedUser from "./db/count-connected-students";
import postFeedBack from "../models/user/feedback/post-feedback";
import congratulateStudent from "./db/congratulate-student";
import User from "../utils/interfaces/db/user";
import getUserGroupId from "./db/get-user-group-id";
import getFeedbacks from "./db/get-connected-contacts";
import getUserData from "./db/get-user-data";
import { feedbackReviewed } from "./helpers/feedback-reviewed";
import { io } from "../server";
import { logger } from "../utils/logs/logger";

export function socket(io: Server): void {
  let groupId: string | null;
  try {
    io.on("connection", async (socket: Socket) => {
      const { userId } = socket.handshake.query as { userId: string };
      try {
        await connect(socket.id, userId);

        const count = await countConnectedUser();
        io.emit("students-count", count);

        groupId = await getUserGroupId(userId);

        if (groupId) {
          if (!socket.rooms.has(groupId)) socket.rooms.add(groupId);
          socket.join(groupId);
        }

        socket.on("disconnect", async () => {
          await disconnect(socket.id);
          const count = await countConnectedUser();
          io.emit("students-count", count);
        });
      } catch (error) {
        console.error(
          "Erreur détectée lors de l'ouverture du socket, interruption de la connexion, IP : " +
            socket.handshake.address
        );
        const childLogger = logger.child({
          from: socket.handshake.address ?? "unknown",
        });

        childLogger.info(
          "Erreur détectée lors de l'ouverture du socket, interruption de la connexion"
        );
        socket.disconnect(true);
      }

      socket.on("students-count", async () => {
        const count = await countConnectedUser();
        io.emit("students-count", count);
      });

      socket.on(
        "receive-student-feedback",
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
              hasBeenReviewed: false,
              userId,
            };
            for (const contact of contactsList) {
              const sock = io.sockets.sockets.get(contact.socketId);
              if (sock) {
                sock.emit("new-feedback-received", feedback);
              } else {
                console.error(`Socket non trouvé pour l'ID : ${contact}`);
              }
            }
          }
        }
      );

      socket.on(
        "feedback-reviewed",
        async ({
          studentId,
          feedbackId,
        }: {
          studentId: string;
          feedbackId: string;
        }) => feedbackReviewed(io, socket, studentId, feedbackId)
      );

      socket.on(
        "receive-accomplishment",
        async ({
          studentMdbIdToFelicitate,
          accomplishmentId,
          idMdbUserFrom,
        }) => {
          const accomplishment = await congratulateStudent(
            studentMdbIdToFelicitate,
            accomplishmentId
          );

          if (accomplishment) {
            const userFrom = await User.findOne({ _id: idMdbUserFrom });
            const nameFrom = `${userFrom?.firstname} ${userFrom?.lastname}`;
            if (groupId) {
              io.to(groupId).emit("send-accomplishment", {
                studentMdbIdToFelicitate,
                nameFrom,
              });
            }
          }
        }
      );
    });
  } catch (error) {
    console.error("Erreur lors de l'ouverture du socket !");
  }
}

export async function userConnectionNotification(
  userId: string,
  notification: string
) {
  const contactsList = await getFeedbacks(userId);

  for (const contact of contactsList) {
    const sock = io.sockets.sockets.get(contact.socketId);
    if (sock) {
      sock.emit("student_connected", notification);
    } else {
      console.error(`Socket non trouvé pour l'ID : ${contact}`);
    }
  }
}
