import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";

export default async function getUserData(userId: string) {
  const user = await User.findOne({ _id: userId }, { password: 0 })
    .populate("connectionInfos")
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("group");

  console.log({ user });

  if (!user) {
    throw { message: "L'apprenant n'existe pas.", statusCode: 404 };
  }

  const parcours = await prisma.group.findFirst({
    where: { idMdb: user.group[0]._id },
    select: {
      parcours: {
        select: {
          parcours: true,
        },
        orderBy: {
          parcoursId: "desc",
        },
        take: 1,
      },
    },
  });

  return {
    user,
    parcours: parcours
      ? parcours.parcours.map((item: any) => item.parcours)[0]
      : null,
  };
}
