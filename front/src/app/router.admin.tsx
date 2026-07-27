import { guard, lazyRoute } from "../utils/helpers/router-helpers";
import { Navigate, RouteObject } from "react-router";
import RouterErrorBoundary from "../components/wrappers/layouts/RouterErrorBoundary";
import { adminGroupRoutes } from "../features/group/routes";
import { adminCourseRoutes } from "../features/course/routes";
import { adminLessonRoutes } from "../features/lesson/routes";
import { adminTagsRoutes } from "../features/tags/routes";
import { adminRoleRoutes } from "../features/role/routes";
import { adminUserRoutes } from "../features/user/routes";
import { adminFormationRoutes } from "../features/formation/routes";
import { adminFeedbacksRoutes } from "../features/feedbacks/routes";
import { adminDashboardIARoutes } from "../features/dashboard-ia/routes";
import { adminModuleRoutes } from "../features/module/routes";
import { adminDashboardRoutes } from "../features/dashboard-admin/routes";
import { adminParcoursRoutes } from "../features/parcours/routes";
import { adminMediathequeRoutes } from "../features/mediatheque/routes";
import { adminResourcesRoutes } from "../features/resources/routes";
import { adminProfileRoutes } from "../features/profile/routes";
import { adminModulePreviewRoutes } from "../features/module-preview/routes";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    lazy: lazyRoute(() => import("../components/wrappers/layouts/AdminLayout")),
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      guard("stats", adminDashboardRoutes),
      guard("parcours", adminParcoursRoutes),
      guard("module", adminModulePreviewRoutes),
      guard("group", adminGroupRoutes),
      guard("module", adminModuleRoutes),
      guard("course", adminCourseRoutes),
      guard("lesson", adminLessonRoutes),
      guard("tag", adminTagsRoutes),
      guard("role", adminRoleRoutes),
      guard("user", adminUserRoutes),
      guard("formation", adminFormationRoutes),
      guard("feedback", adminFeedbacksRoutes),
      guard("dashboardIa", adminDashboardIARoutes),
      guard("mediatheque", adminMediathequeRoutes),
      guard("resource", adminResourcesRoutes),
      guard("cursus", adminProfileRoutes),
      { path: "*", element: <p>La page n'existe pas</p> },
    ],
  },
];
