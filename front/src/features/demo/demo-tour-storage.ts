/**
 * Clé du tour de démonstration, dans `sessionStorage`.
 *
 * Volontairement pas en base : le compte de démonstration est partagé par tous
 * les visiteurs simultanés, et `user.onboarding` est global au compte. Le
 * premier visiteur à terminer le tutoriel en priverait tous les suivants.
 * `sessionStorage` isole chaque onglet, et garantit que la démonstration
 * commence toujours par la visite guidée.
 */
export const DEMO_TOUR_STORAGE_KEY = "andria:demo-tour";

export type DemoTourLayout = "admin" | "student";

export const readDemoTourLayout = (): DemoTourLayout | null => {
  try {
    const value = sessionStorage.getItem(DEMO_TOUR_STORAGE_KEY);
    return value === "admin" || value === "student" ? value : null;
  } catch {
    return null;
  }
};

export const clearDemoTour = () => {
  try {
    sessionStorage.removeItem(DEMO_TOUR_STORAGE_KEY);
  } catch {
    // Navigation privée ou stockage refusé : le tour se relancera, sans plus.
  }
};
