import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const ModulePreview = lazy(() => import("./views/ModulePreview"));

export const adminModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    element: withSuspense(ModulePreview),
  },
];

export const studentModulePreviewRoutes: RouteObject[] = [
  {
    path: "parcours/module/:moduleId",
    element: withSuspense(ModulePreview),
  },
];
