import { log } from "console";
import elasticSearchClient, { ElasticSchema } from "../elastic-search";

const CourseSchema: ElasticSchema = {
  prismaId: { type: "text" },
  titre: { type: "text" },
  description: { type: "text" },
  objectifs_titre: { type: "text" },
  modules_titre: { type: "text" },
  parcours_id: { type: "integer" },
  parcours_titre: { type: "text" },
  formations_titre: { type: "text" },
  contacts_titre: { type: "text" },
  tags_titre: { type: "text" },
  competences_bonus_titre: { type: "text" },
};

async function createTagsIntoIndex() {
  const coursesDataFromPrisma = await prisma?.course.findMany({
    include: {
      module: {
        select: {
          id: true,
          title: true,
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
        },
      },
      contacts: {
        select: {
          contact: { select: { id: true, name: true } },
        },
      },
      objectives: { select: { objective: { select: { description: true } } } },
      tags: { select: { tag: { select: { name: true } } } },
      bonusSkills: {
        select: { bonusSkill: { select: { description: true } } },
      },
    },
  });

  if (!coursesDataFromPrisma || !(coursesDataFromPrisma.length > 0)) return;

  const operations = coursesDataFromPrisma.flatMap((course) => [
    { index: { _index: "cours" } },
    {
      prismaId: course.id,
      titre: course.title,
      description: course.description,
      objectifs_titre: course.objectives.map(
        (objective) => objective.objective.description
      ),
      module_titre: course.module.title,
      parcours_id: course.module.parcours.map(
        (parcours) => parcours.parcours.id
      ),
      parcours_titre: course.module.parcours.map(
        (parcours) => parcours.parcours.title
      ),
      formations_titre: course.module.parcours.map(
        (parcours) => parcours.parcours.formation.title
      ),
      contacts_titre: course.contacts.map((contact) => contact.contact.name),
      tags_titre: course.tags.map((tag) => tag.tag.name),
      competences_bonus_titre: course.bonusSkills.map(
        (bonusSkill) => bonusSkill.bonusSkill.description
      ),
    },
  ]);

  const bulkResponse = await elasticSearchClient.bulk({
    refresh: true,
    operations,
  });
}

export async function generateCoursesDataIntoIndex() {
  const isIndexExist = await elasticSearchClient.indices
    .get({ index: "cours" })
    .catch((e) =>
      console.log("Index 'cours' does not exist. Data will be generated...")
    );
  if (!isIndexExist) {
    elasticSearchClient.indices
      .create({
        index: "cours",
        mappings: {
          properties: CourseSchema,
        },
      })
      .catch((error) => log(error));
    await createTagsIntoIndex();
  }
}
