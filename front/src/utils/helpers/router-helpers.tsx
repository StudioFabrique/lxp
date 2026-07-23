type LazyRouteModule = { default: React.ComponentType };

/**
 * Uses React Router's route-level lazy API. Contrary to React.lazy elements,
 * the route module starts loading during route matching, in parallel with its
 * parent route and any loaders.
 */
export const lazyRoute =
  (load: () => Promise<LazyRouteModule>) => async () => {
    const routeModule = await load();
    return { Component: routeModule.default };
  };

export const lazyRouteWithWrapper =
  (
    load: () => Promise<LazyRouteModule>,
    wrap: (element: React.ReactNode) => React.ReactNode,
  ) =>
  async () => {
    const routeModule = await load();
    const Page = routeModule.default;
    return { Component: () => wrap(<Page />) };
  };
