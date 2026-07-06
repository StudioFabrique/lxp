// src/features/admin-dashboard/routes.tsx
import { RouteObject } from "react-router";

// const AdminDashboard = lazy(() => import("./view/AdminDashboard"));

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    index: true,
    element: <p>Dashboard Admin</p>,
    // { index: true, element: withSuspense(AdminDashboard) },
  },
];

export const studentDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    index: true,
    element: <p>Dashboard Étudiant</p>,
    // { index: true, element: withSuspense(StudentDashboard) },
  },
];
