import { log } from "console";
import elasticSearchClient, { ElasticSchema } from "../elastic-search";

const ContactSchema: ElasticSchema = {
  mdbId: { type: "text" },
  prismaId: { type: "text" },
  nom: { type: "text" },
  parcours_id: { type: "integer" },
};

async function createContactsIntoIndex() {
  const contactsDataFromPrisma = await prisma?.contact.findMany({
    include: { parcours: { select: { parcours: { select: { id: true } } } } },
  });

  if (!contactsDataFromPrisma || !(contactsDataFromPrisma.length > 0)) return;

  const operations = contactsDataFromPrisma.flatMap((contact) => [
    { index: { _index: "contacts" } },
    {
      prismaId: contact.id,
      mdbId: contact.idMdb,
      nom: contact.name,
      parcours_id: contact.parcours.map((parcours) => parcours.parcours.id),
    },
  ]);

  const bulkResponse = await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });
}

export async function generateContactsDataIntoIndex() {
  const isIndexExist = await elasticSearchClient.indices
    .get({ index: "contacts" })
    .catch((e) =>
      console.log("Index 'contacts' does not exist. Data will be generated...")
    );
  if (!isIndexExist) {
    elasticSearchClient.indices
      .create({
        index: "contacts",
        mappings: {
          properties: ContactSchema,
        },
      })
      .catch((error) => log(error));
    await createContactsIntoIndex();
  }
}
