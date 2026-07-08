import { createBrowserRouter, Navigate, RouteObject } from "react-router";

import { authRoutes } from "./features/auth/routes";

import {
  adminParcoursRoutes,
  studentParcoursRoutes,
} from "./features/parcours/routes";
import { adminGroupRoutes } from "./features/group/routes";
import { adminCourseRoutes } from "./features/course/routes";
import { adminLessonRoutes } from "./features/lesson/routes";
import { adminTagsRoutes } from "./features/tags/routes";
import { adminRoleRoutes } from "./features/role/routes";
import { adminUserRoutes } from "./features/user/routes";
import { adminFormationRoutes } from "./features/formation/routes";
import { adminFeedbacksRoutes } from "./features/feedbacks/routes";
import { adminDashboardIARoutes } from "./features/dashboard-ia/routes";
import { adminModuleRoutes } from "./features/module/routes";
import {
  adminModulePreviewRoutes,
  studentModulePreviewRoutes,
} from "./features/module-preview/routes";
import {
  adminResourcesRoutes,
  studentResourcesRoutes,
} from "./features/resources/routes";
import { adminMediathequeRoutes } from "./features/mediatheque/routes";
import { studentCalendarRoutes } from "./features/calendar/routes";
import {
  adminProfileRoutes,
  studentProfileRoutes,
} from "./features/profile/routes";
import {
  adminDashboardRoutes,
  studentDashboardRoutes,
} from "./features/dashboard/routes";
import StudentLayout from "./components/wrappers/layouts/StudentLayout";
import AdminLayout from "./components/wrappers/layouts/AdminLayout";
import RouterErrorBoundary from "./components/wrappers/layouts/RouterErrorBoundary";
import FeaturesList from "./features/dashboard/views/FeaturesList";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      ...adminDashboardRoutes,
      ...adminParcoursRoutes,
      ...adminModulePreviewRoutes,
      ...adminGroupRoutes,
      ...adminModuleRoutes,
      ...adminCourseRoutes,
      ...adminLessonRoutes,
      ...adminTagsRoutes,
      ...adminRoleRoutes,
      ...adminUserRoutes,
      ...adminFormationRoutes,
      ...adminFeedbacksRoutes,
      ...adminDashboardIARoutes,
      ...adminMediathequeRoutes,
      ...adminResourcesRoutes,
      ...adminProfileRoutes,
      { path: "*", element: <p>La page n'existe pas</p> },
    ],
  },
];

const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: <StudentLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      ...studentDashboardRoutes,
      ...studentParcoursRoutes,
      ...studentModulePreviewRoutes,
      ...studentResourcesRoutes,
      ...studentCalendarRoutes,
      ...studentProfileRoutes,
      { path: "*", element: <FeaturesList /> },
    ],
  },
];

export const router = createBrowserRouter([
  ...authRoutes,
  ...adminRoutes,
  ...studentRoutes,
  {
    path: "*",
    element: <Navigate replace to="/login" />,
  },
]);
