import User from "../../utils/interfaces/db/user";

export default async function postCheckEmail(email: string) {
  const existingUser = await User.findOne({ email });
  console.log({ existingUser });
  if (!existingUser)
    throw { statusCode: 404, message: "L'utilisateur n'existe pas." };
}
