import { createBrowserRouter, Navigate } from "react-router";

import { authRoutes } from "./features/auth/routes";
import { adminRoutes } from "./features/admin-dashboard/routes";
import { studentRoutes } from "./features/student-dashboard/routes";

export const router = createBrowserRouter([
  ...authRoutes,
  ...studentRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <Navigate replace to="/login" />,
  },
]);
