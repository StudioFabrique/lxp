import { studentParcoursRoutes } from "../features/parcours/routes";
import { studentModulePreviewRoutes } from "../features/module-preview/routes";
import { studentResourcesRoutes } from "../features/resources/routes";
import { studentCalendarRoutes } from "../features/calendar/routes";
import { studentProfileRoutes } from "../features/profile/routes";
import RouterErrorBoundary from "../components/wrappers/layouts/RouterErrorBoundary";
import { studentDashboardRoutes } from "../features/dashboard-student/routes";
import { guard, lazyRoute } from "../utils/helpers/router-helpers";
import { Navigate, RouteObject } from "react-router";

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    HydrateFallback: () => null,
    lazy: lazyRoute(
      () => import("../components/wrappers/layouts/StudentLayout"),
    ),
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      guard("cursus", studentDashboardRoutes),
      guard("parcours", studentParcoursRoutes),
      guard("module", studentModulePreviewRoutes),
      guard("resource", studentResourcesRoutes),
      guard("cursus", studentCalendarRoutes),
      guard("cursus", studentProfileRoutes),
      {
        path: "*",
        lazy: lazyRoute(
          () => import("../features/dashboard-student/views/FeaturesList"),
        ),
      },
    ],
  },
];
