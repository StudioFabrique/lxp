import { createBrowserRouter } from "react-router";
import { authRoutes } from "../features/auth/routes";
import { demoRoutes } from "../features/demo/routes";
import { adminRoutes } from "./router.admin";
import { studentRoutes } from "./router.student";
import AccessDenied from "../components/guards/AccessDenied";
import DefaultRedirect from "../components/guards/DefaultRedirect";

export const router = createBrowserRouter([
  ...demoRoutes,
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
    element: <DefaultRedirect />,
    HydrateFallback: () => null,
  },
]);
