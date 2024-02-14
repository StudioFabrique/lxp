import User from "../../utils/interfaces/db/user";

async function getUser(userId: Object) {
  const user = await User.findOne({ _id: userId }, { password: 0 })
    .populate("roles")
    .populate("connectionInfos", { duration: 1 });

  if (!user) {
    const error: any = {
      message: "L'utilisateur n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  return user;
}

export default getUser;
