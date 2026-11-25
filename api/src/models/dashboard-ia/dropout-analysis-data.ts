import { prisma } from "../../utils/db.ts";
import User from "../../utils/interfaces/db/user.ts";
import Group from "../../utils/interfaces/db/group.ts";
import {
  DropoutAlertReview,
  DropoutGroupAlertSettings,
  DropoutPrediction,
  DropoutWeek,
} from "../../services/dropout-analysis.ts";

export type DropoutFrequency = "weekly" | "monthly";

export type DropoutPreferencesUpdate = {
  enabled: boolean;
  frequency: DropoutFrequency;
  minCritical: number;
  completeOnboarding: boolean;
};

/** Parcours assignés à un formateur (via ses contacts). */
export async function getAssignedParcoursIds(userId: string) {
  const contacts = await prisma.orm.public.Contact.where({ idMdb: userId })
    .select("id")
    .include("parcours", (p) => p.select("parcoursId"))
    .all();
  return contacts.flatMap((c) => c.parcours.map((p) => p.parcoursId));
}

/** Liaisons groupe (id Mongo) / parcours actuellement en vigueur. */
export async function getGroupParcoursLinks() {
  const links = await prisma.orm.public.GroupsOnParcours.include("group", (group) =>
    group.select("idMdb"),
  ).all();
  return links.map((link) => ({ groupId: link.group?.idMdb, parcoursId: link.parcoursId }));
}

export async function getUserDropoutPreferences(userId: string) {
  const user = await User.findById(userId).select("dropoutAnalysis").lean();
  return user?.dropoutAnalysis;
}

export async function updateUserDropoutPreferences(
  userId: string,
  { enabled, frequency, minCritical, completeOnboarding }: DropoutPreferencesUpdate,
) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "dropoutAnalysis.enabled": enabled,
        "dropoutAnalysis.frequency": frequency,
        "dropoutAnalysis.minCritical": minCritical,
        ...(completeOnboarding ? { "dropoutAnalysis.onboardingCompletedAt": new Date() } : {}),
      },
    },
    { new: true },
  )
    .select("dropoutAnalysis")
    .lean();
  return user?.dropoutAnalysis;
}

/** Analyses terminées, les plus récentes d'abord ; filtrées sur un groupe si fourni. */
export async function findCompleteDropoutWeeks(groupId?: string) {
  const filter = groupId ? { status: "complete", "groups.groupId": groupId } : { status: "complete" };
  return DropoutWeek.find(filter).sort({ completedAt: -1 }).lean();
}

export async function findReviewedKeys(keys: string[]) {
  const reviews = await DropoutAlertReview.find({ key: { $in: keys } })
    .select("key")
    .lean();
  return new Set(reviews.map((item) => item.key));
}

export async function isAlertReviewed(key: string) {
  return Boolean(await DropoutAlertReview.exists({ key }));
}

export async function upsertAlertReview(review: {
  key: string;
  teacherId: string;
  groupId: string;
  weekKey: string;
}) {
  await DropoutAlertReview.updateOne(
    { key: review.key },
    { $setOnInsert: { ...review, reviewedAt: new Date() } },
    { upsert: true },
  );
}

export async function findAlertSettingsForGroups(teacherId: string, groupIds: string[]) {
  return DropoutGroupAlertSettings.find({ teacherId, groupId: { $in: groupIds } })
    .select("groupId disabledStudentIds")
    .lean();
}

export async function findAlertSettingsByKey(key: string) {
  return DropoutGroupAlertSettings.findOne({ key }).select("disabledStudentIds").lean();
}

export async function upsertAlertSettings(settings: {
  key: string;
  teacherId: string;
  groupId: string;
  disabledStudentIds: string[];
}) {
  const { key, ...fields } = settings;
  await DropoutGroupAlertSettings.updateOne({ key }, { $set: fields }, { upsert: true });
}

/** Identifiants des membres de chaque groupe, indexés par groupe. */
export async function findGroupMembers(groupIds: string[]) {
  const groups = await Group.find().where("_id").in(groupIds).select("_id users").lean();
  return new Map(groups.map((group) => [String(group._id), new Set((group.users ?? []).map(String))]));
}

/** Membres d'un groupe, ou `null` si le groupe n'existe pas. */
export async function findGroupUserIds(groupId: string) {
  const group = await Group.findById(groupId).select("users").lean();
  return group ? (group.users ?? []).map(String) : null;
}

export async function findCriticalPredictions(weekKeys: string[]) {
  return DropoutPrediction.find({ week: { $in: weekKeys }, status: "complete", critical: true })
    .select("week userId")
    .lean();
}

export async function findCompletePredictions(weekKey: string, userIds: string[]) {
  return DropoutPrediction.find({ week: weekKey, userId: { $in: userIds }, status: "complete" })
    .select("userId critical effectiveLevel indicators coverage")
    .lean();
}

export async function findUserDisplayNames(userIds: string[]) {
  const users = await User.find().where("_id").in(userIds).select("firstname lastname").lean();
  return new Map(users.map((user) => [String(user._id), `${user.firstname} ${user.lastname}`]));
}
