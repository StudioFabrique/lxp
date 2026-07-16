import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    element: withSuspense(lazy(() => import("./views/ModuleContentExplorer"))),
  },
];

export const studentModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    element: withSuspense(lazy(() => import("./views/ModuleContentExplorer"))),
  },
];
