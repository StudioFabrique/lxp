import { whereFromObject } from "../../utils/prisma-query.ts";
import { calculateModuleProgress } from "../../helpers/calculate-module-progress.ts";
import { enrichContactsWithNames } from "../../helpers/enrich-contacts-with-names.ts";
import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import {
  moduleWhereForScope,
  type AccessScope,
} from "../../utils/services/permissions/accessible-parcours.ts";
import { canUnassignTag } from "../tag/tag-access.ts";
import { loadSkillAchievements } from "../../helpers/skill-achievement-query.ts";

/**
 * Récupère les détails d'un parcours par son ID
 */
async function getParcoursById(
  parcoursId: number,
  userId: string,
  scope: AccessScope = null,
) {
  // 1. Récupération des données brutes
  const parcours = await prisma.orm.public.Parcours.where((row) =>
    whereFromObject(row, { id: parcoursId }),
  )
    .select(
      "id",
      "title",
      "description",
      "startDate",
      "endDate",
      "image",
      "virtualClass",
      "isPublished",
      "visibility",
    )
    .include("formation", (related214) =>
      related214
        .select("id", "title", "level")
        .include("tags", (related215) =>
          related215.include("tag", (related216) =>
            related216.select("id", "name", "color"),
          ),
        ),
    )
    .include("tags", (related217) =>
      related217
        .select("addedBy")
        .include("tag", (related218) =>
          related218.select("id", "name", "color"),
        ),
    )
    .include("contacts", (related219) => related219.include("contact"))
    .include("skills", (related220) => related220.include("skill"))
    .include("bonusSkills", (related221) => related221)
    .include("objectives", (related222) =>
      related222.select("id", "description"),
    )
    .include("modules", (related223) =>
      related223
        .where((row) => whereFromObject(row, moduleWhereForScope(scope)))
        .select(
          "id",
          "duration",
          "minDate",
          "maxDate",
          "title",
          "description",
          "quizInstructions",
          "thumb",
        )
        .include("contacts", (related224) => related224.include("contact"))
        .include("bonusSkills", (related225) =>
          related225.include("bonusSkill", (related226) =>
            related226.select("id", "description", "badge"),
          ),
        )
        .include("courses", (related227) =>
          related227
            .include("assignment", (related228) =>
              related228.include("submissions", (related229) =>
                related229
                  .where((row) =>
                    whereFromObject(row, { student: { idMdb: userId } }),
                  )
                  .select("submittedAt"),
              ),
            )
            .include("lessons", (related230) =>
              related230
                .include("lessonsRead", (related231) =>
                  related231
                    .where((row) =>
                      whereFromObject(row, { student: { idMdb: userId } }),
                    )
                    .select("id", "finishedAt"),
                )
                .orderBy((row) => row.order.asc()),
            )
            .orderBy((row) => row.order.asc()),
        ),
    )
    .include("groups", (related232) =>
      related232.include("group", (related233) =>
        related233.select("id", "idMdb"),
      ),
    )
    .include("admin", (related234) => related234.select("id", "idMdb"))
    .first();

  // 2. Gestion d'erreur (Guard Clause)
  if (!parcours) {
    const error: any = {
      message: "Le parcours n'existe pas.",
      statusCode: 404,
    };
    throw error;
  }

  const namedContacts = await enrichContactsWithNames([
    ...parcours.contacts.map(({ contact }) => contact),
    ...parcours.modules.flatMap(({ contacts }) =>
      contacts.map(({ contact }) => contact),
    ),
  ]);
  const contactsByMongoId = new Map(
    namedContacts.map((contact) => [contact.idMdb, contact]),
  );
  const skillAchievements = await loadSkillAchievements(userId, {
    skillIds: parcours.bonusSkills.map(({ id }) => id),
  });

  // 3. Initialisation de l'objet résultat
  // On utilise 'any' ici pour pouvoir modifier les types (Buffer -> string) et ajouter des propriétés
  let result: any = {
    ...parcours,
    bonusSkills: parcours.bonusSkills.map(({ id }) => skillAchievements.get(id)!),
    canManage:
      scope?.kind !== "teacher" ||
      scope.directParcoursIds?.includes(parcours.id),
  };

  // 4. Traitement de l'image principale
  result.image = parcours.image
    ? Buffer.from(parcours.image as any).toString("base64")
    : null;

  // 5. Traitement des contacts (aplatissement)
  // Transforme [{ contact: {...} }] en [{...}]
  result.contacts = parcours.contacts.map(({ contact }) =>
    contactsByMongoId.get(contact.idMdb)!,
  );
  result.tags = parcours.tags.map(({ tag, addedBy }) => ({
    ...tag,
    canUnassign: canUnassignTag(
      { addedBy },
      { userId, isAdmin: scope === null },
    ),
  }));

  // 6. Traitement des modules (si présents)
  if (parcours.modules && parcours.modules.length > 0) {
    result.modules = parcours.modules.map((item: any) => {
      // Image du module
      const thumb = item.thumb
        ? Buffer.from(item.thumb as any).toString("base64")
        : null;

      // Contacts du module (aplatissement)
      const moduleContacts = item.contacts.map(({ contact }: any) =>
        contactsByMongoId.get(contact.idMdb)!,
      );

      return {
        ...item,
        thumb,
        // Calcul de la progression via la fonction helper
        stats: {
          progress: calculateModuleProgress(item),
        },
        contacts: moduleContacts,
      };
    });
  }

  // 7. Calcul du nombre d'étudiants
  if (parcours.groups && parcours.groups.length > 0) {
    const usersCount = await User.countDocuments({
      group: { $in: parcours.groups.map((g: any) => g.group.idMdb) },
    });
    result.studentCount = usersCount;
  }

  // 8. Retour unique
  return result;
}

export default getParcoursById;
