import { whereFromObject } from "../../utils/prisma-query.ts";
import { prisma } from "../../utils/db.ts";

async function getCourseScenario(courseId: number) {
  const scenario = await prisma.orm.public.Course.where((row) =>
    whereFromObject(row, { id: courseId }),
  )
    .select("scenario")
    .include("lessons", (related44) =>
      related44
        .select("id", "title", "description", "modalite", "order")
        .include("tag"),
    )
    .first();

  if (!scenario) {
    const error = new Error(
      "Le cours n'existe pas ou n'a aucun scénario associé",
    );
    (error as any).statusCode = 404;
    throw error;
  }

  return scenario;
}

export default getCourseScenario;
