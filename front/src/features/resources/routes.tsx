import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminResourcesRoutes: RouteObject[] = [
  {
    path: "resources",
    element: withSuspense(lazy(() => import("./views/ResourcesLayout"))),
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/ResourcesHome"))),
      },
      {
        path: "add",
        element: withSuspense(lazy(() => import("./views/ResourceAdd"))),
      },
      {
        path: "edit/:resourceId",
        element: withSuspense(lazy(() => import("./views/ResourceAdd"))),
      },
    ],
  },
];

export const studentResourcesRoutes: RouteObject[] = [
  {
    path: "ressources",
    element: withSuspense(lazy(() => import("./views/StudentResourcesLayout"))),
    children: [
      {
        index: true,
        element: withSuspense(
          lazy(() => import("./views/StudentResourceHome")),
        ),
      },
      {
        path: "details/:resourceId",
        element: withSuspense(
          lazy(() => import("./views/StudentResourceDetails")),
        ),
      },
    ],
  },
];
