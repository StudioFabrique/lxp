import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getUnsplashPresentationImage } from "../../helpers/unsplash-presentation-image.ts";

async function createParcours(parcours: any, userId: string) {
  console.log({ userId });

  const existingFormation = await prisma.formation.findFirst({
    where: { id: +parcours.formation },
  });

  if (!existingFormation) {
    const error: any = {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const admin = await prisma.admin.findFirst({
    where: { idMdb: userId },
    select: { id: true },
  });

  if (!admin) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 403;
    throw error;
  }

  const user = await User.findOne(
    { _id: userId },
    { firstname: 1, lastname: 1 },
  );

  if (!user) {
    const error = new Error("L'utilisateur n'existe pas");
    (error as any).statusCode = 403;
    throw error;
  }

  const author = `${user.firstname} ${user.lastname}`;

  const newParcours = { ...parcours, admin, author };

  const existtingParcours = await prisma.parcours.findFirst({
    where: { title: newParcours.title },
  });

  if (existtingParcours) {
    const error = new Error("Un parcours avec ce titre existe déjà");
    (error as any).statusCode = 409;
    throw error;
  }

  const defaultImage = await getUnsplashPresentationImage(newParcours.title);
  const storedParcours = await prisma.parcours.create({
    data: {
      ...newParcours,
      admin: {
        connect: { id: newParcours.admin.id },
      },
      formation: {
        connect: { id: +newParcours.formation },
      },
      image: newParcours.image ?? defaultImage,
      thumb: newParcours.thumb ?? defaultImage,
    },
  });

  return storedParcours;
}

export default createParcours;
