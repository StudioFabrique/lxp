import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    lazy: lazyRoute(() => import("./views/ModuleContentExplorer")),
  },
];

export const studentModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    lazy: lazyRoute(() => import("./views/ModuleContentExplorer")),
  },
];
