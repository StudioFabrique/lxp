// src/features/admin-dashboard/routes.tsx
import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const studentDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: withSuspense(lazy(() => import("./views/StudentDashboard"))),
  },
];
