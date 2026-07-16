import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminUserRoutes: RouteObject[] = [
  {
    path: "user",
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/UserHome"))),
      },
      {
        path: "add",
        element: withSuspense(lazy(() => import("./views/UserAdd"))),
      },
      {
        path: "edit/:id",
        element: withSuspense(lazy(() => import("./views/UserEdit"))),
      },
    ],
  },
];
