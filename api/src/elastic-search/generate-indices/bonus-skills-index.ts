import { log } from "console";
import elasticSearchClient, { ElasticSchema } from "../elastic-search";
import { prisma } from "../../utils/db";

const bonusSkillSchema: ElasticSchema = {
  prismaId: { type: "text" },
  titre: { type: "text" },
  parcours_id: { type: "integer" },
};

async function createBonusSkillsIntoIndex() {
  const bonusSkillsDataFromPrisma = await prisma.bonusSkill.findMany({
    include: { parcours: { select: { id: true } } },
  });

  if (!bonusSkillsDataFromPrisma || !(bonusSkillsDataFromPrisma.length > 0))
    return;

  const operations = bonusSkillsDataFromPrisma.flatMap((skill) => [
    { index: { _index: "compétences_bonus" } },
    {
      prismaId: skill.id,
      titre: skill.description,
    },
  ]);

  const bulkResponse = await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });
}

export async function generateBonusSkillsDataIntoIndex() {
  const isIndexExist = await elasticSearchClient.indices
    .get({ index: "compétences_bonus" })
    .catch((e) =>
      console.log(
        "Index 'compétences_bonus' does not exist. Data will be generated..."
      )
    );
  if (!isIndexExist) {
    elasticSearchClient.indices
      .create({
        index: "compétences_bonus",
        mappings: {
          properties: bonusSkillSchema,
        },
      })
      .catch((error) => log(error));
    await createBonusSkillsIntoIndex();
  }
}
