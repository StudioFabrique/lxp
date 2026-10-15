import { vi } from "vitest";

// Node 26 expose un localStorage expérimental, vide sans l'option dédiée.
// Il masque donc celui de JSDOM injecté par Vitest.
const jsdomWindow = (
  globalThis as typeof globalThis & { jsdom?: { window: Window } }
).jsdom?.window;

// React 19 exige ce marqueur pour considérer Vitest comme un environnement
// compatible avec act(). Le définir ici couvre tous les tests de composants.
Object.defineProperty(globalThis, "IS_REACT_ACT_ENVIRONMENT", {
  configurable: true,
  value: true,
  writable: true,
});

if (jsdomWindow) {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: jsdomWindow.localStorage,
  });
}

// Les composants lisent les libellés de rôles via une requête. Les tests
// qui n'installent pas de QueryClient reçoivent les libellés par défaut ;
// le hook réel est testé via `vi.importActual`.
vi.mock("../features/role/hooks/useRoleLabels", async () => {
  const { DEFAULT_ROLE_LABELS, getRoleLabelForRank, toInlineRoleLabel } =
    await import("../features/role/helpers/role-labels");
  return {
    useRoleLabels: () => ({
      labels: DEFAULT_ROLE_LABELS,
      getRoleLabel: (rank: number, fallback?: string) =>
        getRoleLabelForRank(DEFAULT_ROLE_LABELS, rank, fallback),
      teamLabel: DEFAULT_ROLE_LABELS[2],
      teamInlineLabel: toInlineRoleLabel(DEFAULT_ROLE_LABELS[2]),
    }),
  };
});
