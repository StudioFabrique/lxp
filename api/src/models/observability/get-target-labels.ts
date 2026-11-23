import mongoose from "mongoose";
import { prisma } from "../../utils/db.ts";
import Group from "../../utils/interfaces/db/group.ts";
import type {
  TargetKind,
  TargetRef,
} from "../../utils/services/observability/route-targets.ts";
import getUserIdentitiesByIds from "../user/get-user-identities-by-ids.ts";

/** Clé d'un contenu dans le résultat : `<type>:<identifiant>`. */
export const targetKey = (kind: TargetKind, id: string) => `${kind}:${id}`;

const idsOf = (refs: TargetRef[], kind: TargetKind): string[] =>
  refs.filter((ref) => ref.kind === kind).map((ref) => ref.id);

const numeric = (ids: string[]) => ids.map(Number);

/**
 * Titres (ou noms) des contenus désignés dans les journaux. Une lecture groupée
 * par type : jamais une requête par ligne. Un contenu supprimé est simplement
 * absent du résultat.
 */
export default async function getTargetLabels(
  refs: TargetRef[],
): Promise<Map<string, string>> {
  const labels = new Map<string, string>();
  const put = (kind: TargetKind, id: string | number, label: string | null) => {
    if (label) labels.set(targetKey(kind, String(id)), label);
  };

  const lessons = numeric(idsOf(refs, "lesson"));
  const courses = numeric(idsOf(refs, "course"));
  const modules = numeric(idsOf(refs, "module"));
  const parcours = numeric(idsOf(refs, "parcours"));
  const formations = numeric(idsOf(refs, "formation"));
  const activities = numeric(idsOf(refs, "activity"));
  const resources = numeric(idsOf(refs, "resource"));
  const groupIds = idsOf(refs, "group").filter((id) =>
    mongoose.isValidObjectId(id),
  );
  const userIds = idsOf(refs, "user");

  const orm = prisma.orm.public;
  const [
    lessonRows,
    courseRows,
    moduleRows,
    parcoursRows,
    formationRows,
    activityRows,
    resourceRows,
    groupRows,
    userRows,
  ] = await Promise.all([
    lessons.length ? orm.Lesson.where((row) => row.id.in(lessons)).select("id", "title").all() : [],
    courses.length ? orm.Course.where((row) => row.id.in(courses)).select("id", "title").all() : [],
    modules.length ? orm.Module.where((row) => row.id.in(modules)).select("id", "title").all() : [],
    parcours.length ? orm.Parcours.where((row) => row.id.in(parcours)).select("id", "title").all() : [],
    formations.length ? orm.Formation.where((row) => row.id.in(formations)).select("id", "title").all() : [],
    activities.length ? orm.Activity.where((row) => row.id.in(activities)).select("id", "title").all() : [],
    resources.length ? orm.Resource.where((row) => row.id.in(resources)).select("id", "title").all() : [],
    groupIds.length ? Group.find({ _id: { $in: groupIds } }, { name: 1 }).lean() : [],
    userIds.length ? getUserIdentitiesByIds(userIds) : [],
  ]);

  lessonRows.forEach((row) => put("lesson", row.id, row.title));
  courseRows.forEach((row) => put("course", row.id, row.title));
  moduleRows.forEach((row) => put("module", row.id, row.title));
  parcoursRows.forEach((row) => put("parcours", row.id, row.title));
  formationRows.forEach((row) => put("formation", row.id, row.title));
  // Une activité peut ne pas avoir de titre : on le dit plutôt que de l'omettre.
  activityRows.forEach((row) => put("activity", row.id, row.title || "Activité sans titre"));
  resourceRows.forEach((row) => put("resource", row.id, row.title));
  groupRows.forEach((row) => put("group", row._id.toString(), row.name));
  userRows.forEach((row) =>
    put("user", row.id, `${row.firstname} ${row.lastname}`.trim()),
  );

  return labels;
}
