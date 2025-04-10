import { activationToken } from "../../helpers/activation-token";
import { sendPasswordEmail } from "../../services/mailer";
import User from "../../utils/interfaces/db/user";

export default async function postManyInvitations(userIds: string[]) {
  const users = await User.find({
    _id: {
      $in: userIds,
    },
  }).populate("roles");

  if (users.length !== userIds.length) {
    throw { message: "Un ou plusieurs utilisateurs n'ont pas été trouvés." };
  }

  for (const user of users) {
    const token = activationToken(user._id, user.roles[0], "7d");
    await sendPasswordEmail(user.email, token, "activation");
  }
}
