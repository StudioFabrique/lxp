// src/features/admin-dashboard/routes.tsx
import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";
const StudentDashboard = lazy(() => import("./views/StudentDashboard"));

export const studentDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: withSuspense(StudentDashboard),
  },
];
