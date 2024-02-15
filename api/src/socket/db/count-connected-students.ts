import UserSocket from "../../utils/interfaces/db/user-socket";

export default async function countConnectedUser() {
  return await UserSocket.count({ rank: { $gt: 2 } });
}
