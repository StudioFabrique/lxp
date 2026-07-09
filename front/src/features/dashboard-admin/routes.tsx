// src/features/admin-dashboard/routes.tsx
import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

const AdminDashboard = lazy(() => import("./views/AdminDashboard"));

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    element: withSuspense(AdminDashboard),
  },
];
