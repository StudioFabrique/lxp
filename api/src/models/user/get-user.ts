import User from "../../utils/interfaces/db/user.model";

async function getUser(userId: Object) {
  const user = User.findOne({ _id: userId }).populate("roles");
  return user;
}

export default getUser;
