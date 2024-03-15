import { prisma } from "../../utils/db";
import { log } from "console";
import elasticSearchClient, { ElasticSchema } from "../elastic-search";

const SkillSchema: ElasticSchema = {
  prismaId: { type: "text" },
  titre: { type: "text" },
  parcours_id: { type: "integer" },
};

async function createObjectivesIntoIndex() {
  const skillsDataFromPrisma = await prisma.objective.findMany({
    include: { parcours: { select: { id: true } } },
  });

  if (!skillsDataFromPrisma || !(skillsDataFromPrisma.length > 0)) return;

  const operations = skillsDataFromPrisma.flatMap((skill) => [
    { index: { _index: "objectifs" } },
    {
      prismaId: skill.id,
      titre: skill.description,
      parcours_id: skill.parcours.id,
    },
  ]);

  const bulkResponse = await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });
}

export async function generateObjectivesDataIntoIndex() {
  const isIndexExist = await elasticSearchClient.indices
    .get({ index: "objectifs" })
    .catch((e) =>
      console.log("Index 'objectifs' does not exist. Data will be generated...")
    );
  if (!isIndexExist) {
    elasticSearchClient.indices
      .create({
        index: "objectifs",
        mappings: {
          properties: SkillSchema,
        },
      })
      .catch((error) => log(error));
    await createObjectivesIntoIndex();
  }
}
