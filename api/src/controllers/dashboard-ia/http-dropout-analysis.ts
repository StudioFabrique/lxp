import type { Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import User from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";
import { DropoutAlertReview, DropoutGroupAlertSettings, DropoutPrediction, DropoutWeek } from "../../services/dropout-analysis.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { dropoutOnboardingRequired } from "../../services/dropout-analysis-logic.ts";

async function assignedParcours(userId: string) {
  const contacts = await prisma.orm.public.Contact.where({ idMdb: userId }).select("id")
    .include("parcours", (p) => p.select("parcoursId")).all();
  return contacts.flatMap((c) => c.parcours.map((p) => p.parcoursId));
}

const reviewKey = (teacherId: string, groupId: string, weekKey: string) =>
  `${teacherId}:${groupId}:${weekKey}`;
const settingsKey = (teacherId: string, groupId: string) => `${teacherId}:${groupId}`;

async function teacherCanAccessGroup(teacherId: string, groupId: string) {
  const parcoursIds = new Set(await assignedParcours(teacherId));
  const links = await prisma.orm.public.GroupsOnParcours.include("group", (group) => group.select("idMdb")).all();
  return links.some((link) => link.group?.idMdb === groupId && parcoursIds.has(link.parcoursId));
}

export async function getDropoutPreferences(req: CustomRequest, res: Response) {
  const userId = req.auth!.userId;
  if (req.auth!.userRoles[0]?.rank !== 2) return res.status(403).json({ message: "Réservé aux formateurs" });
  const [user, parcoursIds] = await Promise.all([User.findById(userId).select("dropoutAnalysis").lean(), assignedParcours(userId)]);
  return res.json({ enabled: user?.dropoutAnalysis?.enabled ?? false,
    frequency: user?.dropoutAnalysis?.frequency ?? "weekly",
    minCritical: user?.dropoutAnalysis?.minCritical ?? 1,
    hasParcours: parcoursIds.length > 0,
    onboardingRequired: dropoutOnboardingRequired(parcoursIds.length > 0, user?.dropoutAnalysis?.onboardingCompletedAt) });
}

export async function putDropoutPreferences(req: CustomRequest, res: Response) {
  if (req.auth!.userRoles[0]?.rank !== 2) return res.status(403).json({ message: "Réservé aux formateurs" });
  if ((await assignedParcours(req.auth!.userId)).length === 0) return res.status(403).json({ message: "Aucun parcours rattaché" });
  const { enabled, frequency, minCritical = 1, completeOnboarding = true } = req.body ?? {};
  if (typeof enabled !== "boolean" || !["weekly", "monthly"].includes(frequency) || ![1, 2].includes(minCritical) || typeof completeOnboarding !== "boolean") return res.status(400).json({ message: "Préférences invalides" });
  const user = await User.findByIdAndUpdate(req.auth!.userId, { $set: {
    "dropoutAnalysis.enabled": enabled,
    "dropoutAnalysis.frequency": frequency,
    "dropoutAnalysis.minCritical": minCritical,
    ...(completeOnboarding ? { "dropoutAnalysis.onboardingCompletedAt": new Date() } : {}),
  } }, { new: true }).select("dropoutAnalysis").lean();
  return res.json({ enabled: user?.dropoutAnalysis?.enabled, frequency: user?.dropoutAnalysis?.frequency, minCritical: user?.dropoutAnalysis?.minCritical ?? 1, hasParcours: true, onboardingRequired: !user?.dropoutAnalysis?.onboardingCompletedAt });
}

export async function getDropoutSummaries(req: CustomRequest, res: Response) {
  const rank = req.auth!.userRoles[0]?.rank;
  if (rank === undefined || rank > 2) return res.status(403).json({ message: "Accès interdit" });
  const parcoursIds = rank === 2 ? new Set(await assignedParcours(req.auth!.userId)) : null;
  const currentGroupIds = parcoursIds ? new Set((await prisma.orm.public.GroupsOnParcours
    .include("group", (group) => group.select("idMdb")).all())
    .filter((link) => parcoursIds.has(link.parcoursId)).map((link) => link.group!.idMdb)) : null;
  const weeks = await DropoutWeek.find({ status: "complete" }).sort({ completedAt: -1 }).lean();
  const byGroup = new Map<string, { groupId: string; name: string; analyzed: number; critical: number; alertCritical: number; completedAt: Date; weekKey: string; reviewed: boolean }>();
  for (const week of weeks) for (const group of week.groups ?? []) {
    if (parcoursIds && (!parcoursIds.has(group.parcoursId!) || !currentGroupIds?.has(group.groupId!))) continue;
    if (!byGroup.has(group.groupId!)) byGroup.set(group.groupId!, {
      groupId: group.groupId!, name: group.name!, analyzed: group.analyzed!, critical: group.critical!, completedAt: week.completedAt!,
      weekKey: week.key!, reviewed: false, alertCritical: group.critical!,
    });
  }
  if (rank === 2 && byGroup.size) {
    const keys = [...byGroup.values()].map((group) => reviewKey(req.auth!.userId, group.groupId, group.weekKey));
    const reviews = await DropoutAlertReview.find({ key: { $in: keys } }).select("key").lean();
    const reviewed = new Set(reviews.map((item) => item.key));
    for (const group of byGroup.values()) group.reviewed = reviewed.has(reviewKey(req.auth!.userId, group.groupId, group.weekKey));
    const settings = await DropoutGroupAlertSettings.find({ teacherId: req.auth!.userId,
      groupId: { $in: [...byGroup.keys()] } }).select("groupId disabledStudentIds").lean();
    const disabled = new Map(settings.map((item) => [item.groupId, new Set(item.disabledStudentIds ?? [])]));
    const groups = await Group.find().where("_id").in([...byGroup.keys()]).select("_id users").lean();
    const members = new Map(groups.map((group) => [String(group._id), new Set((group.users ?? []).map(String))]));
    const predictions = await DropoutPrediction.find({ week: { $in: [...new Set([...byGroup.values()].map((group) => group.weekKey))] },
      status: "complete", critical: true }).select("week userId").lean();
    for (const group of byGroup.values()) {
      const studentIds = members.get(group.groupId);
      const disabledIds = disabled.get(group.groupId);
      group.alertCritical = predictions.filter((prediction) => prediction.week === group.weekKey
        && studentIds?.has(prediction.userId!) && !disabledIds?.has(prediction.userId!)).length;
    }
  }
  return res.json([...byGroup.values()]);
}

export async function reviewGroupDropoutAlert(req: CustomRequest, res: Response) {
  if (req.auth!.userRoles[0]?.rank !== 2) return res.status(403).json({ message: "Réservé aux formateurs" });
  const groupId = String(req.params.groupId);
  const weekKey = req.body?.weekKey;
  if (typeof weekKey !== "string" || !weekKey || weekKey.length > 100) {
    return res.status(400).json({ message: "Analyse invalide" });
  }
  const parcoursIds = new Set(await assignedParcours(req.auth!.userId));
  const links = await prisma.orm.public.GroupsOnParcours.include("group", (group) => group.select("idMdb")).all();
  const currentParcoursIds = new Set(links.filter((link) => link.group?.idMdb === groupId).map((link) => link.parcoursId));
  if (![...currentParcoursIds].some((id) => parcoursIds.has(id))) {
    return res.status(403).json({ message: "Accès interdit" });
  }
  const weeks = await DropoutWeek.find({ status: "complete", "groups.groupId": groupId })
    .sort({ completedAt: -1 }).lean();
  const week = weeks.find((item) => item.groups?.some((group) => group.groupId === groupId
    && parcoursIds.has(group.parcoursId!) && currentParcoursIds.has(group.parcoursId!)));
  if (!week) return res.status(404).json({ message: "Analyse introuvable" });
  if (week.key !== weekKey) return res.status(409).json({ message: "Une nouvelle analyse est disponible" });
  const key = reviewKey(req.auth!.userId, groupId, weekKey);
  await DropoutAlertReview.updateOne({ key }, { $setOnInsert: {
    key, teacherId: req.auth!.userId, groupId, weekKey, reviewedAt: new Date(),
  } }, { upsert: true });
  return res.json({ reviewed: true });
}

export async function getGroupDropoutAnalysis(req: CustomRequest, res: Response) {
  const rank = req.auth!.userRoles[0]?.rank;
  if (rank === undefined || rank > 2) return res.status(403).json({ message: "Accès interdit" });
  const groupId = String(req.params.groupId);
  const parcoursIds = rank === 2 ? new Set(await assignedParcours(req.auth!.userId)) : null;
  const linkedGroups = parcoursIds ? await prisma.orm.public.GroupsOnParcours
    .include("group", (group) => group.select("idMdb")).all() : [];
  const currentParcoursIds = new Set(linkedGroups.filter((link) => link.group?.idMdb === groupId).map((link) => link.parcoursId));
  if (parcoursIds && ![...currentParcoursIds].some((id) => parcoursIds.has(id))) {
    return res.status(403).json({ message: "Accès interdit" });
  }
  const weeks = await DropoutWeek.find({ status: "complete", "groups.groupId": groupId })
    .sort({ completedAt: -1 }).lean();
  const week = weeks.find((item) => item.groups?.some((group) => group.groupId === groupId
    && (!parcoursIds || parcoursIds.has(group.parcoursId!) && currentParcoursIds.has(group.parcoursId!))));
  const summary = week?.groups?.find((group) => group.groupId === groupId
    && (!parcoursIds || parcoursIds.has(group.parcoursId!) && currentParcoursIds.has(group.parcoursId!)));
  if (!week || !summary) return res.status(404).json({ message: "Analyse introuvable" });

  const reviewed = rank === 2 ? Boolean(await DropoutAlertReview.exists({
    key: reviewKey(req.auth!.userId, groupId, week.key!),
  })) : false;
  const settings = rank === 2 ? await DropoutGroupAlertSettings.findOne({
    key: settingsKey(req.auth!.userId, groupId),
  }).select("disabledStudentIds").lean() : null;

  const group = await Group.findById(groupId).select("users").lean();
  const userIds = (group?.users ?? []).map(String);
  const predictions = await DropoutPrediction.find({ week: week.key, userId: { $in: userIds }, status: "complete" })
    .select("userId critical effectiveLevel indicators coverage").lean();
  const users = await User.find().where("_id").in(predictions.map((prediction) => prediction.userId))
    .select("firstname lastname").lean();
  const names = new Map(users.map((user) => [String(user._id), `${user.firstname} ${user.lastname}`]));
  return res.json({ groupId, name: summary.name, analyzed: summary.analyzed,
    critical: summary.critical,
    alertCritical: predictions.filter((prediction) => prediction.critical
      && !settings?.disabledStudentIds?.includes(prediction.userId!)).length,
    completedAt: week.completedAt, weekKey: week.key,
    reviewed, canReview: rank === 2, canManageAlerts: rank === 2,
    disabledStudentIds: settings?.disabledStudentIds ?? [],
    students: predictions.map((prediction) => ({
      userId: prediction.userId, name: names.get(prediction.userId!) ?? "Apprenant",
      critical: prediction.critical, effectiveLevel: prediction.effectiveLevel ?? (prediction.critical ? 3 : 0),
      indicators: prediction.indicators ?? null, coverage: prediction.coverage ?? null,
    })).sort((a, b) => Number(b.critical) - Number(a.critical) || a.name.localeCompare(b.name, "fr")) });
}

export async function putGroupDropoutAlertSettings(req: CustomRequest, res: Response) {
  if (req.auth!.userRoles[0]?.rank !== 2) return res.status(403).json({ message: "Réservé aux formateurs" });
  const groupId = String(req.params.groupId);
  if (!(await teacherCanAccessGroup(req.auth!.userId, groupId))) {
    return res.status(403).json({ message: "Accès interdit" });
  }
  const ids = req.body?.disabledStudentIds;
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string") || ids.length > 1000) {
    return res.status(400).json({ message: "Sélection invalide" });
  }
  const group = await Group.findById(groupId).select("users").lean();
  if (!group) return res.status(404).json({ message: "Groupe introuvable" });
  const members = new Set((group.users ?? []).map(String));
  const uniqueIds = [...new Set<string>(ids)];
  if (uniqueIds.some((id) => !members.has(id))) return res.status(400).json({ message: "Étudiant hors du groupe" });
  const key = settingsKey(req.auth!.userId, groupId);
  await DropoutGroupAlertSettings.updateOne({ key }, { $set: {
    teacherId: req.auth!.userId, groupId, disabledStudentIds: uniqueIds,
  } }, { upsert: true });
  return res.json({ disabledStudentIds: uniqueIds });
}
