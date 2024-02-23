import UserSocket from "../../utils/interfaces/db/user-socket";

export default async function getConnectedStudent(studentId: string) {
  const socket = await UserSocket.findOne(
    { userId: studentId },
    { socketId: 1 }
  );
  return socket?.socketId;
}
