import Group from "../../utils/interfaces/db/group";
import mongoose from "mongoose";

async function getUsersByGroup(groupsIds: string[]) {
  const ids = groupsIds.map(
    (item: string) => new mongoose.Types.ObjectId(item)
  );

  const group = await Group.find({ _id: { $in: ids } }).populate("users", {});
  console.log({ group });

  if (!group) {
    const error = { message: "Groupe inexistant", statusCode: 404 };
    throw error;
  } else {
    return group;
  }
}

export default getUsersByGroup;
