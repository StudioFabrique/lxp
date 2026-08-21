import type { Express } from "express";

export type DeclaredRoute = { method: string; path: string };

/**
 * Énumère toutes les routes déclarées par l'application.
 *
 * Deux routeurs (`chatbot`, `resources`) sont bâtis avec `import Router from
 * "express"`, c'est-à-dire avec la fabrique d'application et non
 * `express.Router()` : ils sont montés comme des sous-applications et rangent
 * leurs couches sous `_router`. Les ignorer laisserait six routes d'écriture
 * hors du champ de vérification.
 */
function stackOf(handle: any): any[] | undefined {
  if (Array.isArray(handle?.stack)) return handle.stack;
  if (Array.isArray(handle?._router?.stack)) return handle._router.stack;
  return undefined;
}

function prefixOf(layer: any): string {
  const source: string = layer.regexp?.source ?? "";
  const matched = source.match(/^\^\\\/(.*?)\\\/\?\(\?=\\\/\|\$\)$/);
  return matched ? "/" + matched[1].replace(/\\\//g, "/") : "";
}

export function listDeclaredRoutes(app: Express): DeclaredRoute[] {
  const routes: DeclaredRoute[] = [];

  const walk = (stack: any[], prefix: string) => {
    for (const layer of stack) {
      if (layer.route) {
        for (const [method, enabled] of Object.entries(layer.route.methods)) {
          if (enabled) {
            routes.push({
              method: method.toUpperCase(),
              path: prefix + layer.route.path,
            });
          }
        }
        continue;
      }

      const sub = stackOf(layer.handle);
      if (sub) walk(sub, prefix + prefixOf(layer));
    }
  };

  walk(stackOf(app) ?? [], "");
  return routes;
}

export function listMutatingRoutes(app: Express): DeclaredRoute[] {
  const readMethods = new Set(["GET", "HEAD", "OPTIONS"]);
  return listDeclaredRoutes(app).filter(
    (route) => !readMethods.has(route.method),
  );
}
