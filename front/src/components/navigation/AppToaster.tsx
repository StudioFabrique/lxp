import { useEffect, useSyncExternalStore } from "react";
import type { createBrowserRouter } from "react-router";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

type ToasterRouter = Pick<ReturnType<typeof createBrowserRouter>, "state" | "subscribe">;

/** Nombre maximal de toasts affichés en même temps : un nouveau toast fait disparaître le plus ancien. */
const TOAST_LIMIT = 2;

/** Identifiant du toast émis par `lib/axios.ts` quand le verrou de démonstration bloque une écriture. */
const DEMO_READ_ONLY_TOAST_ID = "demo-read-only";

const PARCOURS_EDIT_PATH = /\/parcours\/edit\/[^/]+/;

/** Édition d'un parcours : la barre des étapes occupe le haut de l'écran, les toasts s'affichent donc
 * en bas, juste au-dessus de la barre d'actions flottante (Retour, Publier, Sauvegarder). */
const PARCOURS_EDIT_CONTAINER_STYLE = { bottom: "6.5rem" };

/** Toaster de l'application : en haut au centre, sauf sur l'édition d'un parcours. */
export default function AppToaster({ router }: Readonly<{ router: ToasterRouter }>) {
  const isParcoursEdit = useSyncExternalStore(
    router.subscribe,
    () => PARCOURS_EDIT_PATH.test(router.state.location.pathname),
  );

  const { toasts } = useToasterStore();
  useEffect(() => {
    // Une écriture bloquée par la démonstration est déjà signalée par
    // l'intercepteur HTTP : l'échec générique que le composant appelant affiche
    // dans la foulée (« Impossible d'enregistrer… ») ferait doublon.
    const demoBlocked = toasts.some(
      (item) => item.visible && item.id === DEMO_READ_ONLY_TOAST_ID,
    );
    if (demoBlocked) {
      toasts
        .filter((item) => item.visible && item.type === "error")
        .forEach((item) => toast.dismiss(item.id));
    }

    // `toasts` est trié du plus récent au plus ancien.
    toasts
      .filter((item) => item.visible)
      .filter((_, index) => index >= TOAST_LIMIT)
      .forEach((item) => toast.dismiss(item.id));
  }, [toasts]);

  return (
    <Toaster
      position={isParcoursEdit ? "bottom-center" : "top-center"}
      containerStyle={isParcoursEdit ? PARCOURS_EDIT_CONTAINER_STYLE : undefined}
      toastOptions={{
        style: {
          background: "var(--color-base-100)",
          color: "var(--color-base-content)",
          border: "1px solid var(--color-base-300)",
          borderRadius: "var(--radius-box)",
          padding: "12px 16px",
          maxWidth: "min(32rem, calc(100vw - 2rem))",
        },
        success: {
          iconTheme: {
            primary: "var(--color-success)",
            secondary: "var(--color-success-content)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--color-error)",
            secondary: "var(--color-error-content)",
          },
        },
      }}
    />
  );
}
