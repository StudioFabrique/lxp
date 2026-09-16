import type { Express, Router } from "express";

export type DeclaredRoute = { method: string; path: string };

const mountPathKey = Symbol("expressMountPath");

type ExpressRoute = {
  methods: Record<string, boolean>;
  path: string | string[];
};

type ExpressLayer = {
  handle?: unknown;
  regexp?: { source?: string };
  route?: ExpressRoute;
  [mountPathKey]?: string;
};

type StackOwner = {
  stack?: unknown;
  router?: { stack?: unknown };
  _router?: { stack?: unknown };
};

/**
 * Énumère toutes les routes déclarées par l'application.
 *
 * Deux routeurs (`chatbot`, `resources`) sont bâtis avec `import Router from
 * "express"`, c'est-à-dire avec la fabrique d'application et non
 * `express.Router()` : ils sont montés comme des sous-applications et rangent
 * leurs couches sous `_router`. Les ignorer laisserait six routes d'écriture
 * hors du champ de vérification.
 */
function stackOf(handle: unknown): ExpressLayer[] | undefined {
  if (
    (typeof handle !== "object" || handle === null) &&
    typeof handle !== "function"
  ) {
    return undefined;
  }

  const owner = handle as StackOwner;
  if (Array.isArray(owner.stack)) return owner.stack as ExpressLayer[];
  if (Array.isArray(owner.router?.stack)) {
    return owner.router.stack as ExpressLayer[];
  }
  if (Array.isArray(owner._router?.stack)) {
    return owner._router.stack as ExpressLayer[];
  }
  return undefined;
}

function prefixOf(layer: ExpressLayer): string {
  if (typeof layer?.[mountPathKey] === "string") {
    return layer[mountPathKey];
  }

  const source: string = layer.regexp?.source ?? "";
  const matched = source.match(/^\^\\\/(.*?)\\\/\?\(\?=\\\/\|\$\)$/);
  return matched ? "/" + matched[1].replace(/\\\//g, "/") : "";
}

/**
 * Monte un routeur et conserve son préfixe pour l'énumération des routes.
 *
 * Express 5 ne garde plus le chemin de montage sous forme de `regexp`
 * accessible sur une couche. Enregistrer le préfixe lors du montage évite de
 * dépendre de la structure privée de `path-to-regexp`.
 */
export function mountRouter<T extends Express | Router>(
  parent: T,
  path: string,
  ...handlers: unknown[]
): T {
  const before = stackOf(parent)?.length ?? 0;
  const use = parent.use.bind(parent) as (
    mountPath: string,
    ...mountedHandlers: unknown[]
  ) => unknown;
  use(path, ...handlers);

  for (const layer of stackOf(parent)?.slice(before) ?? []) {
    layer[mountPathKey] = path;
  }

  return parent;
}

export function listDeclaredRoutes(app: Express): DeclaredRoute[] {
  const routes: DeclaredRoute[] = [];

  const walk = (stack: ExpressLayer[], prefix: string) => {
    for (const layer of stack) {
      if (layer.route) {
        for (const [method, enabled] of Object.entries(layer.route.methods)) {
          if (enabled) {
            const paths = Array.isArray(layer.route.path)
              ? layer.route.path
              : [layer.route.path];

            for (const path of paths) {
              routes.push({
                method: method.toUpperCase(),
                path: prefix + path,
              });
            }
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
