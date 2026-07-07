import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const Profile = lazy(() => import("./views/Profile"));

export const adminProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    element: withSuspense(Profile),
  },
];

export const studentProfileRoutes: RouteObject[] = [
  {
    path: "profil",
    element: withSuspense(Profile),
  },
];
