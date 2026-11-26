import {
  sendPasswordChangedEmail,
  sendUpdatedUserEmail,
} from "../../services/mailer.ts";
import { logger } from "../../utils/logs/logger.ts";
import type { UserChange } from "./changed-user-fields.ts";

export type UserUpdateActor = "admin" | "self";

/**
 * Fenêtre de regroupement. Une modification depuis l'administration part en
 * plusieurs requêtes successives (profil, puis rôle) : sans regroupement, le
 * titulaire recevrait un mail par requête pour une seule action.
 */
export const NOTIFICATION_GROUPING_DELAY_MS = 5_000;

type PendingNotification = {
  email: string;
  changes: Map<string, UserChange>;
  modifiedBy: UserUpdateActor;
  timer: NodeJS.Timeout;
};

/**
 * Regroupement en mémoire, propre à l'instance : un redémarrage dans la
 * fenêtre perd le message en attente, ce que la nature informative du mail
 * autorise.
 */
const pending = new Map<string, PendingNotification>();

function flush(key: string) {
  const entry = pending.get(key);
  if (!entry) return;
  pending.delete(key);

  void sendUpdatedUserEmail(
    entry.email,
    [...entry.changes.values()],
    entry.modifiedBy,
  ).catch((error: unknown) => {
    logger.error(
      `Notification de mise à jour non envoyée à ${entry.email}`,
      error instanceof Error ? error : new Error(String(error)),
    );
  });
}

/**
 * Prévient le titulaire d'une modification de son compte.
 *
 * Aucun message n'est envoyé :
 * - si rien n'a changé ;
 * - si le compte n'a jamais reçu son invitation (`invitationSent` faux) : son
 *   titulaire ne le connaît pas encore.
 *
 * Les modifications d'un même compte arrivant dans la fenêtre de regroupement
 * partent dans un seul message ; pour un même champ, la dernière valeur prime.
 * L'envoi est détaché de la réponse : la modification est déjà enregistrée et
 * l'attendre ferait dépendre le temps de réponse du serveur SMTP.
 */
export function notifyUserUpdated(input: {
  email: string;
  invitationSent: boolean;
  changes: UserChange[];
  modifiedBy: UserUpdateActor;
}) {
  if (!input.invitationSent) {
    // Sans trace, un compte créé hors invitation (seed, import) semble
    // simplement « ne pas recevoir de mail ». Aucune donnée personnelle ici.
    logger.info(
      "Notification de mise à jour ignorée : aucune invitation n'a été envoyée à ce compte.",
    );
    return;
  }
  if (input.changes.length === 0) return;

  const key = input.email.trim().toLowerCase();
  const existing = pending.get(key);
  if (existing) clearTimeout(existing.timer);

  const changes = existing?.changes ?? new Map<string, UserChange>();
  for (const change of input.changes) changes.set(change.label, change);

  const timer = setTimeout(() => flush(key), NOTIFICATION_GROUPING_DELAY_MS);
  // Ne retient pas l'arrêt du processus.
  timer.unref();

  pending.set(key, {
    email: input.email,
    changes,
    // Un changement initié par un administrateur reste signalé comme tel.
    modifiedBy:
      existing?.modifiedBy === "admin" || input.modifiedBy === "admin"
        ? "admin"
        : "self",
    timer,
  });
}

/**
 * Confirme un changement de mot de passe. Contrairement aux autres
 * modifications, il n'est pas conditionné à l'invitation : seul le titulaire
 * du compte, donc déjà informé de son existence, peut changer son mot de passe.
 * Détaché de la réponse, comme la notification de mise à jour.
 */
export function notifyPasswordChanged(email: string) {
  void sendPasswordChangedEmail(email).catch((error: unknown) => {
    logger.error(
      `Confirmation de changement de mot de passe non envoyée à ${email}`,
      error instanceof Error ? error : new Error(String(error)),
    );
  });
}
