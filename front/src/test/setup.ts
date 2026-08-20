// Node 26 expose un localStorage expérimental, vide sans l'option dédiée.
// Il masque donc celui de JSDOM injecté par Vitest.
const jsdomWindow = (
  globalThis as typeof globalThis & { jsdom?: { window: Window } }
).jsdom?.window;

if (jsdomWindow) {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: jsdomWindow.localStorage,
  });
}
