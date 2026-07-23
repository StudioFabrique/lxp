// src/features/admin-dashboard/routes.tsx
import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const adminDashboardRoutes: RouteObject[] = [
  {
    path: "dashboard",
    lazy: lazyRoute(() => import("./views/AdminDashboard")),
  },
];
