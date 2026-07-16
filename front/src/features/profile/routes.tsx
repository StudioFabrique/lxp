import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    element: withSuspense(lazy(() => import("./views/Profile"))),
  },
];

export const studentProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    element: withSuspense(lazy(() => import("./views/Profile"))),
  },
];
