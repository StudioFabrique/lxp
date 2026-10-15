import { cn } from "../../utils/cn";

/** Emplacement collant d'une barre de page : seul le `md` et plus se colle. */
export const stickySlotClassName = "md:pointer-events-none md:sticky md:top-0 md:z-30";

/**
 * Aspect de la barre collante, dans l'esprit de `FloatingBottomNavigation` : à sa place c'est le bandeau de page,
 * collée en haut c'est une barre (fond flou, ombre) qui touche le bord de l'écran : seuls ses coins du bas sont arrondis.
 * `width: "full"` garde la largeur de la page (en-têtes de page, dont le contenu reste entier) ;
 * `"narrow"` la réduit à 60 % (étapes, réduites à l'essentiel).
 * Le relais entre plusieurs barres collantes est géré par `StickyBarStackProvider`.
 */
export const stickyBarClassName = (isStuck: boolean, width: "narrow" | "full" = "narrow") =>
  cn(
    "pointer-events-auto mx-auto h-auto border p-3 select-none md:p-4",
    "transition-all duration-300 ease-out motion-reduce:transition-none",
    isStuck
      ? cn(
          width === "full" ? "w-full" : "w-[60vw] max-w-full",
          "rounded-t-none rounded-b-2xl border-t-0 border-base-300 bg-base-200/90 shadow-xl backdrop-blur",
        )
      : "themed-page-header w-full rounded-lg shadow-none",
  );
