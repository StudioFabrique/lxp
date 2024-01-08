import User from "../../utils/interfaces/db/user";

async function updateManyUsersStatus(usersIds: Array<string>, status: string) {
  let actualUsers = await User.find({ _id: usersIds });

  if (actualUsers.length === 0) {
    return false;
  }

  const value = status === "actif";

  const bulkUpdate = usersIds.map((userId) => {
    return {
      updateOne: {
        filter: {
          _id: userId,
        },
        update: {
          isActive: value,
        },
      },
    };
  });

  const updateUsers = await User.bulkWrite(bulkUpdate);
  return updateUsers;
}

export default updateManyUsersStatus;
