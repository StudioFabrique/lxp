import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

/**
 * Entrée publique de la démonstration.
 *
 * Déclarée hors de `authRoutes` : `LoginGuard` n'enveloppe que ces dernières et
 * redirigerait un visiteur déjà connecté vers son espace. Ici, aucune garde.
 */
export const demoRoutes: RouteObject[] = [
  {
    path: "/demo",
    HydrateFallback: () => null,
    lazy: lazyRoute(() => import("./views/DemoEntry")),
  },
];
