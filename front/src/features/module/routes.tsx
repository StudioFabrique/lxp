import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminModuleRoutes: RouteObject[] = [
  {
    path: "module",
    lazy: lazyRoute(() => import("./views/ModuleLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/ModuleHome")),
      },
      {
        path: "import",
        lazy: lazyRoute(() => import("./views/ModuleImport")),
      },
      {
        path: "import-modules",
        lazy: lazyRoute(() => import("./views/ModuleImport")),
      },
    ],
  },
];
