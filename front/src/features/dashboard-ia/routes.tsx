import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

const DashboardIAHome = lazy(() => import("./views/DashboardIAHome"));

export const adminDashboardIARoutes: RouteObject[] = [
  {
    path: "dashboard-ia",
    element: withSuspense(DashboardIAHome),
  },
];
