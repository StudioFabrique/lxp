import { createBrowserRouter, Navigate } from "react-router";
import { authRoutes } from "../features/auth/routes";
import { adminRoutes } from "./router.admin";
import { studentRoutes } from "./router.student";
import AccessDenied from "../components/guards/AccessDenied";

export const router = createBrowserRouter([
  ...authRoutes,
  ...adminRoutes,
  ...studentRoutes,
  {
    path: "/access-denied",
    element: <AccessDenied />,
    HydrateFallback: () => null,
  },
  {
    path: "*",
    element: <Navigate replace to="/login" />,
    HydrateFallback: () => null,
  },
]);
