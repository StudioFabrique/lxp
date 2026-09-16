import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import UserSocket from "../../utils/interfaces/db/user-socket.ts";

export default async function getConnectedContacts(userId: string) {
  const user = await User.findById(userId, { group: 1 });

  if (!user?.group?.length) {
    throw { message: "Le groupe n'existe pas.", statusCode: 404 };
  }
  const groupId = user.group[0]!._id.toString();

  const existingContacts = await prisma.orm.public.Group.where((row) =>
    whereFromObject(row, { idMdb: groupId }),
  )
    .include("parcours", (related54) =>
      related54.include("parcours", (related55) =>
        related55.include("contacts", (related56) =>
          related56.include("contact", (related57) =>
            related57.select("idMdb"),
          ),
        ),
      ),
    )
    .first();

  const contactIds =
    existingContacts?.parcours.flatMap((item) =>
      item.parcours!.contacts.map((contact) => contact.contact!.idMdb),
    ) ?? [];

  return UserSocket.find({ userId: { $in: contactIds } });
}
