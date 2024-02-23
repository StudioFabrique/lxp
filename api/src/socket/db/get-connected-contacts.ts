import { prisma } from "../../utils/db";
import User from "../../utils/interfaces/db/user";
import UserSocket from "../../utils/interfaces/db/user-socket";

export default async function getConnectedContacts(userId: string) {
  const groupId = await User.findOne(
    { _id: userId },
    { firstname: 1, lastname: 1 }
  ).populate("group", { _id: 1 });

  if (!groupId) {
    throw { message: "Le groupe n'existe pas.", statusCode: 404 };
  }

  const existingContacts = await prisma.group.findFirst({
    where: { idMdb: groupId.group._id },
    select: {
      parcours: {
        select: {
          parcours: {
            select: {
              contacts: {
                select: {
                  contact: {
                    select: { idMdb: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  let contactsList = Array<any>();

  if (existingContacts) {
    contactsList = existingContacts.parcours.map((item: any) =>
      item.parcours.contacts.map((elem: any) => new Object(elem.contact.idMdb))
    );
  }

  console.log(contactsList[0]);

  contactsList = await UserSocket.find({ userId: { $in: contactsList[0] } });

  console.log({ contactsList });

  return contactsList;
}
