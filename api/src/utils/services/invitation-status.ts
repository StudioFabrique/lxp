/**
 * Durée au-delà de laquelle un envoi d'invitation annoncé « en cours » est tenu
 * pour abandonné.
 *
 * Un envoi interrompu par un redémarrage ne repart pas de lui-même : sans ce
 * plafond, la liste des utilisateurs afficherait un indicateur d'attente qui ne
 * se résoudrait jamais et masquerait le bouton de renvoi.
 */
export const INVITATION_PENDING_TIMEOUT_MS = 5 * 60 * 1000;

export function isInvitationPending(
  invitationPendingSince?: Date | null,
  now = new Date(),
): boolean {
  if (!invitationPendingSince) return false;

  return (
    now.getTime() - invitationPendingSince.getTime() <
    INVITATION_PENDING_TIMEOUT_MS
  );
}
