import type { Response } from "express";
import type CustomRequest from "../../utils/interfaces/express/custom-request.ts";
import User from "../../utils/interfaces/db/user.ts";
import { prisma } from "../../utils/db.ts";
import { DropoutPrediction, DropoutWeek } from "../../services/dropout-analysis.ts";
import Group from "../../utils/interfaces/db/group.ts";
import { dropoutOnboardingRequired } from "../../services/dropout-analysis-logic.ts";

async function assignedParcours(userId: string) {
  const contacts = await prisma.orm.public.Contact.where({ idMdb: userId }).select("id")
    .include("parcours", (p) => p.select("parcoursId")).all();
  return contacts.flatMap((c) => c.parcours.map((p) => p.parcoursId));
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
  const byGroup = new Map<string, { groupId: string; name: string; analyzed: number; critical: number; completedAt: Date }>();
  for (const week of weeks) for (const group of week.groups ?? []) {
    if (parcoursIds && (!parcoursIds.has(group.parcoursId!) || !currentGroupIds?.has(group.groupId!))) continue;
    if (!byGroup.has(group.groupId!)) byGroup.set(group.groupId!, {
      groupId: group.groupId!, name: group.name!, analyzed: group.analyzed!, critical: group.critical!, completedAt: week.completedAt!,
    });
  }
  return res.json([...byGroup.values()]);
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

  const group = await Group.findById(groupId).select("users").lean();
  const userIds = (group?.users ?? []).map(String);
  const predictions = await DropoutPrediction.find({ week: week.key, userId: { $in: userIds }, status: "complete" })
    .select("userId critical effectiveLevel indicators coverage").lean();
  const users = await User.find().where("_id").in(predictions.map((prediction) => prediction.userId))
    .select("firstname lastname").lean();
  const names = new Map(users.map((user) => [String(user._id), `${user.firstname} ${user.lastname}`]));
  return res.json({ groupId, name: summary.name, analyzed: summary.analyzed,
    critical: summary.critical, completedAt: week.completedAt,
    students: predictions.map((prediction) => ({
      userId: prediction.userId, name: names.get(prediction.userId!) ?? "Apprenant",
      critical: prediction.critical, effectiveLevel: prediction.effectiveLevel ?? (prediction.critical ? 3 : 0),
      indicators: prediction.indicators ?? null, coverage: prediction.coverage ?? null,
    })).sort((a, b) => Number(b.critical) - Number(a.critical) || a.name.localeCompare(b.name, "fr")) });
}
