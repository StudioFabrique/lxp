import Group from "../../utils/interfaces/db/group";
import mongoose from "mongoose";

async function getUsersByGroup(groupsIds: string[]) {
  const ids = groupsIds.map(
    (item: string) => new mongoose.Types.ObjectId(item)
  );

  const group = await Group.find({ _id: { $in: ids } }).populate("users", {
    _id: 1,
    firstname: 1,
    lastname: 1,
    avatar: 1,
  });

  if (!group) {
    const error = { message: "Groupe inexistant", statusCode: 404 };
    throw error;
  } else {
    let updatedGroups: any = [];
    for (const item of group) {
      updatedGroups = [
        ...updatedGroups,
        {
          _id: item._id,
          name: item.name,
          users: item.users.map((user: any) => ({
            ...user.toObject(),
            avatar: user.avatar ? user.avatar.toString("base64") : null,
          })),
        },
      ];
    }

    return updatedGroups;
  }
}

export default getUsersByGroup;
