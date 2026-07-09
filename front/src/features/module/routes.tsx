import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

const ModuleLayout = lazy(() => import("./views/ModuleLayout"));
const ModuleHome = lazy(() => import("./views/ModuleHome"));
const ModuleAdd = lazy(() => import("./views/ModuleAdd"));
const ModuleEditLayout = lazy(() => import("./views/ModuleEditLayout"));
const ModuleEdit = lazy(() => import("./views/ModuleEdit"));
const ModuleImport = lazy(() => import("./views/ModuleImport"));

export const adminModuleRoutes: RouteObject[] = [
  {
    path: "module",
    element: withSuspense(ModuleLayout),
    children: [
      { index: true, element: withSuspense(ModuleHome) },
      { path: "add", element: withSuspense(ModuleAdd) },
      { path: "import", element: withSuspense(ModuleImport) },
      { path: "import-modules", element: withSuspense(ModuleImport) },
      {
        path: "edit",
        element: withSuspense(ModuleEditLayout),
        children: [{ path: ":moduleId", element: withSuspense(ModuleEdit) }],
      },
    ],
  },
];
