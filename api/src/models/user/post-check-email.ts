import User from "../../utils/interfaces/db/user";

export default async function postCheckEmail(email: string) {
  const existingUser = await User.findOne({ email });
}
