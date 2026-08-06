import BlackListedToken from "../../utils/interfaces/db/blacklisted-token.ts";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import User from "../../utils/interfaces/db/user.ts";

export async function blacklistTokens(tokens: Array<string | undefined>) {
  const tokensToBlacklist = tokens.filter(Boolean).map((token) => ({ token }));
  if (tokensToBlacklist.length === 0) return;
  await BlackListedToken.insertMany(tokensToBlacklist, { ordered: false });
}

export async function closeCurrentConnection(userId?: string) {
  const user = await User.findOne({ _id: userId }).populate("roles");
  if (user && user.roles[0].rank > 2) {
    return ConnectionInfos.findOne({
      _id: user.connectionInfos![user.connectionInfos!.length - 1],
    });
  }
  return null;
}
