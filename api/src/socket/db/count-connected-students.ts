import UserSocket from "../../utils/interfaces/db/user-socket.ts";

export default async function countConnectedUser() {
  return await UserSocket.count({ rank: { $gt: 2 } });
}
