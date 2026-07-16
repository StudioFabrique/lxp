import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const adminDashboardIARoutes: RouteObject[] = [
  {
    path: "dashboard-ia",
    element: withSuspense(lazy(() => import("./views/DashboardIAHome"))),
  },
];
