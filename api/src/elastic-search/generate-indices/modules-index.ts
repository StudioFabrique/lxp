import { prisma } from "../../utils/db";
import { log } from "console";
import elasticSearchClient, { ElasticSchema } from "../elastic-search";

const ModuleSchema: ElasticSchema = {
  prismaId: { type: "text" },
  titre: { type: "text" },
  description: { type: "text" },
  parcours_id: { type: "integer" },
  parcours_titre: { type: "text" },
  competences_bonus_titre: { type: "text" },
  cours_titre: { type: "text" },
  contacts_nom: { type: "text" },
};

async function createModulesIntoIndex() {
  const modulesDataFromPrisma = await prisma.module.findMany({
    include: {
      parcours: {
        select: {
          parcours: {
            select: {
              id: true,
              title: true,
              formation: { select: { id: true, title: true } },
            },
          },
        },
      },
      bonusSkills: {
        select: {
          bonusSkill: {
            select: { description: true },
          },
        },
      },
      contacts: {
        select: {
          contact: { select: { name: true } },
        },
      },
      courses: { select: { title: true } },
      formations: {
        select: {
          formation: { select: { title: true } },
        },
      },
    },
  });

  if (!modulesDataFromPrisma || !(modulesDataFromPrisma.length > 0)) return;

  const operations = modulesDataFromPrisma.flatMap((module) => [
    { index: { _index: "modules" } },
    {
      prismaId: module.id,
      titre: module.title,
      description: module.description,
      parcours_id: module.parcours.map((parcours) => parcours.parcours.id),
      parcours_titre: module.parcours.map(
        (parcours) => parcours.parcours.title
      ),
      competences_bonus_titre: module.bonusSkills.map(
        (bonusSkill) => bonusSkill.bonusSkill.description
      ),
      cours_titre: module.courses.map((course) => course.title),
      contacts_nom: module.contacts.map((contact) => contact.contact.name),
    },
  ]);

  const bulkResponse = await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });
}

export async function generateModulesDataIntoIndex() {
  const isIndexExist = await elasticSearchClient.indices
    .get({ index: "modules" })
    .catch((e) =>
      console.log("Index 'modules' does not exist. Data will be generated...")
    );
  if (!isIndexExist) {
    elasticSearchClient.indices
      .create({
        index: "modules",
        mappings: {
          properties: ModuleSchema,
        },
      })
      .catch((error) => log(error));
    await createModulesIntoIndex();
  }
}
