import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminRoleRoutes: RouteObject[] = [
  {
    path: "roles",
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/RoleList"))),
      },
      {
        path: "edit/:id",
        element: withSuspense(lazy(() => import("./views/RoleEdit"))),
      },
    ],
  },
];
