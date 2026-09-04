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
