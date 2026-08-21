/**
 * Neutralise un gestionnaire d'action pendant la démonstration.
 *
 * Pour les composants qui reçoivent leur gestionnaire en propriété plutôt qu'en
 * enfant, là où envelopper dans un élément casserait la mise en page.
 */
export function demoSafeHandler<A extends unknown[]>(
  handler: (...args: A) => void,
  demoMode: boolean,
): (...args: A) => void {
  return demoMode ? () => undefined : handler;
}
