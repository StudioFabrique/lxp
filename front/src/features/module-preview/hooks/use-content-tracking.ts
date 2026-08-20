import { useEffect, useRef } from "react";
import { modulePreviewApi } from "../api/module-preview.api";

export type ContentTrackingType = "module" | "course" | "lesson" | "activity";

/**
 * Intervalle des battements, en millisecondes.
 *
 * Doit rester aligné sur `HEARTBEAT_INTERVAL_MS` côté API : le serveur y borne
 * le temps crédité par battement, un intervalle plus long ici ferait
 * sous-compter le temps de lecture.
 */
export const HEARTBEAT_INTERVAL_MS = 30_000;

/**
 * Mesure le temps réellement passé sur un contenu.
 *
 * Le serveur ne crédite que l'écart entre deux battements, plafonné : c'est
 * lui qui décide de la durée, jamais le navigateur. Les battements sont
 * suspendus quand l'onglet passe en arrière-plan, sinon un onglet oublié
 * accumulerait des heures de « lecture ».
 *
 * L'API répond 204 pour un formateur ou un administrateur, qui ne sont pas
 * suivis : les appels sont sans effet, il n'y a rien à filtrer côté client.
 */
export default function useContentTracking(
  type: ContentTrackingType,
  contentId: number | null | undefined,
) {
  // Évite de relancer l'effet à chaque rendu pour une valeur inchangée.
  const trackedIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!contentId) return;

    trackedIdRef.current = contentId;
    let cancelled = false;

    // Les échecs de suivi ne doivent jamais remonter à l'apprenant : ce n'est
    // pas une fonctionnalité dont dépend sa lecture.
    const begin = () =>
      modulePreviewApi.tracking.begin(type, contentId).catch(() => undefined);
    const heartbeat = () =>
      modulePreviewApi.tracking
        .heartbeat(type, contentId)
        .catch(() => undefined);

    begin();

    const interval = window.setInterval(() => {
      if (cancelled || document.visibilityState !== "visible") return;
      heartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (cancelled) return;
      if (document.visibilityState === "visible") {
        // Repositionne le point de départ : sans cela, le premier battement
        // après un retour d'arrière-plan créditerait le temps d'absence.
        begin();
      } else {
        heartbeat();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      // Dernier battement pour ne pas perdre l'intervalle en cours.
      heartbeat();
    };
  }, [type, contentId]);
}
