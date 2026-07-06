import { createBrowserRouter, Navigate } from "react-router";

import { authRoutes } from "./features/auth/routes";
import { adminRoutes, studentRoutes } from "./features/dashboard/routes";

export const router = createBrowserRouter([
  ...authRoutes,
  ...studentRoutes,
  ...adminRoutes,
  {
    path: "*",
    element: <Navigate replace to="/login" />,
  },
]);
