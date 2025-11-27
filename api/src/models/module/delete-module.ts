import { ModuleMetadata } from "../../../generated/prisma/client";
import { prisma } from "../../utils/db";
import userBelongsToContacts from "../../utils/userBelongsToContacts";

async function deleteModule(moduleId: number, userId: string) {
  const existingModule = await prisma.moduleMetadata.findFirst({
    where: { id: moduleId },
    select: {
      courses: true,
      module: { select: { id: true, metadatas: true } },
      admin: true,
      parcours: {
        select: {
          contacts: { select: { contact: { select: { idMdb: true } } } },
        },
      },
    },
  });

  if (!existingModule) {
    const error = { message: "Le module n'existe pas", statusCode: 404 };
    throw error;
  }

  // throw an error when the current user not belonging to contacts in parcours or is not admin
  await userBelongsToContacts(
    userId,
    existingModule.parcours.contacts.map((contact) => contact.contact),
    "Vous n'êtes pas autorisé à supprimer ce module."
  );

  let deletedModule: ModuleMetadata | null = null;

  const transaction = await prisma.$transaction(async (tx) => {
    deletedModule = await tx.moduleMetadata.delete({
      where: { id: moduleId },
    });
  });

  console.log(existingModule.module.metadatas.length);

  if (existingModule.module.metadatas.length < 2) {
    await prisma.module.delete({
      where: { id: existingModule.module.id },
    });
  }
  return transaction;
}

export default deleteModule;
