import { Server, Socket } from "socket.io";
import connect from "./db/connect.ts";
import disconnect from "./db/disconnect.ts";
import countConnectedUser from "./db/count-connected-students.ts";
import postFeedBack from "../models/user/feedback/post-feedback.ts";
import congratulateStudent from "./db/congratulate-student.ts";
import User from "../utils/interfaces/db/user.ts";
import getUserGroupId from "./db/get-user-group-id.ts";
import getFeedbacks from "./db/get-connected-contacts.ts";
import getUserData from "./db/get-user-data.ts";
import { feedbackReviewed } from "./helpers/feedback-reviewed.ts";
import { io } from "../server.ts";
import { logger } from "../utils/logs/logger.ts";
import { imageToDataUrl } from "../utils/images/image-source.ts";
import { type AppAction, type AppSubject } from "../utils/rbac/ability.ts";
import { authenticateSession } from "../utils/services/auth/authenticate-session.ts";

async function authorizeSocket(
  socket: Socket,
  action: AppAction,
  subject: AppSubject,
) {
  try {
    const auth = await authenticateSession(socket.data.accessToken);
    socket.data.auth = auth;
    if (!auth.ability.can(action, subject)) {
      socket.emit("authorization-error", { status: 403 });
      return null;
    }
    return auth;
  } catch {
    socket.emit("authorization-error", { status: 401 });
    socket.disconnect(true);
    return null;
  }
}

export function socket(io: Server): void {
  try {
    io.on("connection", async (socket: Socket) => {
      const userId = socket.data.auth.userId as string;
      let groupId: string | null = null;
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
        if (!(await authorizeSocket(socket, "read", "user"))) return;
        const count = await countConnectedUser();
        io.emit("students-count", count);
      });

      socket.on(
        "receive-student-feedback",
        async ({ feelingLevel, comment }) => {
          if (!(await authorizeSocket(socket, "write", "cursus"))) return;
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
              avatar: imageToDataUrl(userData.avatar),
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
        }) => {
          if (!(await authorizeSocket(socket, "update", "user"))) return;
          return feedbackReviewed(io, socket, studentId, feedbackId);
        },
      );

      socket.on(
        "receive-accomplishment",
        async ({
          studentMdbIdToFelicitate,
          accomplishmentId,
        }) => {
          const auth = await authorizeSocket(socket, "write", "cursus");
          if (!auth) return;
          const accomplishment = await congratulateStudent(
            studentMdbIdToFelicitate,
            accomplishmentId
          );

          if (accomplishment) {
            const userFrom = await User.findById(auth.userId);
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
