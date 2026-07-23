import { createBrowserRouter, Navigate } from "react-router";
import { authRoutes } from "../features/auth/routes";
import { adminRoutes } from "./router.admin";
import { studentRoutes } from "./router.student";

export const router = createBrowserRouter([
  ...authRoutes,
  ...adminRoutes,
  ...studentRoutes,
  {
    path: "*",
    element: <Navigate replace to="/login" />,
  },
]);
