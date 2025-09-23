import User, { IUser } from "../../utils/interfaces/db/user";

export default async function updateUser(_id: string, user: IUser) {
  console.log("MODEL IS RUNNING");

  const existingUser = await User.findOne({ _id }).populate("roles");

  if (!existingUser)
    throw { message: "L'utilisateur n'existe pas.", statusCode: 404 };

  if (existingUser.roles[0].rank < 3)
    throw {
      message:
        "Vous n'avez pas les droits pour modifier les données personnelles de cet utilisateur.",
      statusCode: 403,
    };

  // isolate some properties of user to prevent security risk
  delete user._id;
  const {
    email,
    hobbies,
    links,
    password,
    graduations,
    roles,
    group,
    ...userDataSecure
  } = user;

  const userUpdated = await User.findOneAndUpdate({ _id }, userDataSecure, {
    new: true,
  });

  if (Boolean(userUpdated)) {
    return userUpdated;
  }

  return null;
}
