import { prisma } from "../../utils/db.ts";
import ConnectionInfos from "../../utils/interfaces/db/connection-infos.ts";
import PromptStats from "../../utils/interfaces/db/prompt-stats.ts";
import { emptyIndicator, type Indicator, type IndicatorContext } from "./types.ts";

export const DAYS_SINCE_LAST_ACTIVITY_KEY = "days_since_last_activity";

const MS_PER_DAY = 24 * 3600 * 1000;

/**
 * Nombre de jours depuis le dernier signe de vie de l'apprenant.
 *
 * Trois sources sont croisées, aucune n'étant suffisante seule : une connexion
 * sans lecture, une lecture sans nouvelle connexion du jour, ou un usage de
 * l'IA depuis un onglet resté ouvert produisent chacun une date différente.
 * Contrairement aux autres indicateurs, on ne borne pas sur la fenêtre : un
 * apprenant absent depuis six mois doit ressortir comme tel.
 */
export default async function getDaysSinceLastActivity(
  context: IndicatorContext,
): Promise<Indicator<number>> {
  const [connection, promptStat, contentRead] = await Promise.all([
    ConnectionInfos.findOne({ userId: context.userIdMdb })
      .select({ lastConnection: 1 })
      .sort({ lastConnection: -1 })
      .lean(),
    PromptStats.findOne({ userId: context.userIdMdb })
      .select({ date: 1 })
      .sort({ date: -1 })
      .lean(),
    context.studentId === null
      ? Promise.resolve(null)
      : prisma.lessonRead.findFirst({
          where: { studentId: context.studentId },
          select: { lastOpenedAt: true },
          orderBy: { lastOpenedAt: "desc" },
        }),
  ]);

  const candidates = [
    connection?.lastConnection,
    promptStat?.date,
    contentRead?.lastOpenedAt,
  ]
    .filter((date): date is Date => Boolean(date))
    .map((date) => new Date(date).getTime());

  if (candidates.length === 0) {
    return emptyIndicator(
      DAYS_SINCE_LAST_ACTIVITY_KEY,
      "Jours depuis la dernière activité",
      "days",
      { reason: "Aucune activité enregistrée pour cet apprenant." },
    );
  }

  const lastActivity = Math.max(...candidates);
  const days = Math.max(
    0,
    Math.floor((context.to.getTime() - lastActivity) / MS_PER_DAY),
  );

  return {
    key: DAYS_SINCE_LAST_ACTIVITY_KEY,
    label: "Jours depuis la dernière activité",
    value: days,
    unit: "days",
    available: true,
    meta: { lastActivityAt: new Date(lastActivity).toISOString() },
  };
}
