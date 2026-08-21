export const DEMO_TOUR_EVENT = "lxp:demo-tour";

export type DemoTourEventDetail = { type: "restart" };

/**
 * Relance du tour de démonstration depuis la barre latérale.
 *
 * Même canal que le bus d'onboarding (`onboarding-events.ts`), pour la même
 * raison : l'émetteur et le récepteur sont trop éloignés dans l'arbre pour
 * qu'un contexte soit justifié.
 */
export const emitDemoTourEvent = (detail: DemoTourEventDetail) => {
  window.dispatchEvent(
    new CustomEvent<DemoTourEventDetail>(DEMO_TOUR_EVENT, { detail }),
  );
};

export const subscribeToDemoTourEvents = (
  listener: (detail: DemoTourEventDetail) => void,
) => {
  const handle = (event: Event) =>
    listener((event as CustomEvent<DemoTourEventDetail>).detail);

  window.addEventListener(DEMO_TOUR_EVENT, handle);
  return () => window.removeEventListener(DEMO_TOUR_EVENT, handle);
};
