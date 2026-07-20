import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminModuleRoutes: RouteObject[] = [
  {
    path: "module",
    element: withSuspense(lazy(() => import("./views/ModuleLayout"))),
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/ModuleHome"))),
      },
      {
        path: "import",
        element: withSuspense(lazy(() => import("./views/ModuleImport"))),
      },
      {
        path: "import-modules",
        element: withSuspense(lazy(() => import("./views/ModuleImport"))),
      },
    ],
  },
];
