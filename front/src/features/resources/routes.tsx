import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminResourcesRoutes: RouteObject[] = [
  {
    path: "resources",
    lazy: lazyRoute(() => import("./views/ResourcesLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/ResourcesHome")),
      },
      {
        path: "add",
        lazy: lazyRoute(() => import("./views/ResourceAdd")),
      },
      {
        path: "edit/:resourceId",
        lazy: lazyRoute(() => import("./views/ResourceAdd")),
      },
    ],
  },
];

export const studentResourcesRoutes: RouteObject[] = [
  {
    path: "ressources",
    lazy: lazyRoute(() => import("./views/StudentResourcesLayout")),
    children: [
      {
        index: true,
        lazy: lazyRoute(() => import("./views/StudentResourceHome")),
      },
      {
        path: "details/:resourceId",
        lazy: lazyRoute(() => import("./views/StudentResourceDetails")),
      },
    ],
  },
];
