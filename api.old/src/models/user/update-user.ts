import User, { IUser } from "../../utils/interfaces/db/user";

export default async function updateUser(_id: string, user: IUser) {
  // isolate some properties of user to prevent security risk
  delete user._id;
  const {
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
