import User from "../../utils/interfaces/db/user.ts";
import type { IRole } from "../../utils/interfaces/db/role.ts";

/** Email et libellé du premier rôle d'un compte, ou `null` si le compte n'existe pas. */
export async function getActivationLinkUser(userId: string | undefined) {
  const user = await User.findById(userId)
    .select("email roles")
    .populate<{ roles: IRole[] }>("roles", "label");
  if (!user) return null;
  return { email: user.email, roleLabel: user.roles[0]?.label ?? null };
}
