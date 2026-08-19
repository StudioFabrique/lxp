/**
 * Constantes du suivi de consultation des contenus.
 *
 * Elles vivent dans `config` et non dans `models` : les validateurs de routes
 * en ont besoin, et le découpage en couches vérifié par
 * `src/helpers/tests/backend-layering.spec.ts` interdit à `routes` d'importer
 * `models`.
 */

export const CONTENT_TYPES = [
  "module",
  "course",
  "lesson",
  "activity",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export function isContentType(value: unknown): value is ContentType {
  return CONTENT_TYPES.includes(value as ContentType);
}

/**
 * Intervalle d'envoi des heartbeats côté client, en millisecondes.
 * Sert de plafond au temps crédité par battement : un client qui espace ou
 * rejoue ses appels ne peut pas s'attribuer plus de deux intervalles.
 */
export const HEARTBEAT_INTERVAL_MS = 30_000;
