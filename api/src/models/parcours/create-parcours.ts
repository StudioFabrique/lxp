import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import { getUnsplashPresentationImage } from "../../helpers/unsplash-presentation-image.ts";

async function createParcours(parcours: any, userId: string) {
  const existingFormation = await prisma.orm.public.Formation.where((row) =>
    whereFromObject(row, { id: +parcours.formation }),
  ).first();

  if (!existingFormation) {
    const error: any = {
      message: "La formation n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const admin = await prisma.orm.public.Admin.where((row) =>
    whereFromObject(row, { idMdb: userId }),
  )
    .select("id")
    .first();

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

  const existtingParcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { title: newParcours.title }),
  ).first();

  if (existtingParcours) {
    const error = new Error("Un parcours avec ce titre existe déjà");
    (error as any).statusCode = 409;
    throw error;
  }

  const defaultImage = await getUnsplashPresentationImage(newParcours.title);
  const storedParcours = await prisma.orm.public.Parcours.create({
    ...newParcours,
    admin: (relation) => relation.connect({ id: newParcours.admin.id }),
    formation: (relation) => relation.connect({ id: +newParcours.formation }),
    image: newParcours.image ?? defaultImage,
    thumb: newParcours.thumb ?? defaultImage,
  });

  return storedParcours;
}

export default createParcours;
