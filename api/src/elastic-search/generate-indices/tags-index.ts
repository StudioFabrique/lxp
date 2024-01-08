import { log } from "console";
import elasticSearchClient, { ElasticSchema } from "../elastic-search";

const TagSchema: ElasticSchema = {
  mdbId: { type: "text" },
  titre: { type: "text" },
  couleur: { type: "text" },
  parcours_id: { type: "integer" },
};

async function createTagsIntoIndex() {
  const tagsDataFromPrisma = await prisma?.tag.findMany({
    include: { parcours: { select: { parcours: { select: { id: true } } } } },
  });

  if (!tagsDataFromPrisma || !(tagsDataFromPrisma.length > 0)) return;

  const operations = tagsDataFromPrisma.flatMap((tag) => [
    { index: { _index: "tags" } },
    {
      prismaId: tag.id,
      titre: tag.name,
      couleur: tag.color,
      parcours_id: tag.parcours.map((parcours) => parcours.parcours.id),
    },
  ]);

  const bulkResponse = await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });
}

export async function generateTagsDataIntoIndex() {
  const isIndexExist = await elasticSearchClient.indices
    .get({ index: "tags" })
    .catch((e) =>
      console.log("Index 'tags' does not exist. Data will be generated...")
    );
  if (!isIndexExist) {
    elasticSearchClient.indices
      .create({
        index: "tags",
        mappings: {
          properties: TagSchema,
        },
      })
      .catch((error) => log(error));
    await createTagsIntoIndex();
  }
}
