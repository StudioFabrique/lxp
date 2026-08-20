import ConnectionInfos from "../../interfaces/db/connection-infos.ts";
import PromptStats from "../../interfaces/db/prompt-stats.ts";
import StudentFeedback from "../../interfaces/db/student-feedback.ts";
import { logger } from "../../logs/logger.ts";

/**
 * Aligne les index des collections servant au calcul des indicateurs.
 *
 * Mongoose crée les index déclarés automatiquement quand `autoIndex` est actif,
 * ce qui n'est pas garanti en production. Ces trois collections sont scannées
 * par `models/indicators`, un scan complet y devient coûteux dès quelques
 * milliers d'apprenants.
 */
export default async function syncAnalyticsIndexes() {
  try {
    await Promise.all([
      ConnectionInfos.syncIndexes(),
      PromptStats.syncIndexes(),
      StudentFeedback.syncIndexes(),
    ]);
  } catch (error) {
    // Un index manquant dégrade les performances mais ne doit pas empêcher
    // le démarrage de l'API.
    logger.error("⚠️  Synchronisation des index analytics échouée :", error);
  }
}
