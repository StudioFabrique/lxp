// src/features/admin-dashboard/routes.tsx
import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

const AdminDashboard = lazy(() => import("./views/AdminDashboard"));
const StudentDashbord = lazy(() => import("./views/StudentDashboard"));

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    index: true,
    element: withSuspense(AdminDashboard),
  },
];

export const studentDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    index: true,
    element: withSuspense(StudentDashbord),
  },
];
