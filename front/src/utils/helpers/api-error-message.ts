import { AxiosError } from "axios";

type ApiErrorPayload = {
  message?: string;
  errors?: Array<{ msg?: string }>;
};

/**
 * Message d'erreur à afficher pour une requête rejetée.
 *
 * L'API qualifie ses refus (409 sur un email ou un nom de groupe déjà pris,
 * 400 sur une validation) avec un message rédigé pour l'utilisateur. Les
 * mutations qui n'exposaient aucun `onError` laissaient ce message inutilisé :
 * le formulaire restait tel quel, sans indiquer pourquoi rien ne s'était
 * passé. `fallback` ne sert qu'aux erreurs sans message exploitable (réseau,
 * 500 générique).
 */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    return payload?.message ?? payload?.errors?.[0]?.msg ?? fallback;
  }

  return fallback;
}

/** Vrai si la requête a été refusée pour cause de ressource déjà existante. */
export function isConflictError(error: unknown) {
  return error instanceof AxiosError && error.response?.status === 409;
}
