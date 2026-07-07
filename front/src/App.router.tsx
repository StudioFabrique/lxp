import { createBrowserRouter, Navigate, RouteObject } from "react-router";

import { authRoutes } from "./features/auth/routes";
import AppWrapper from "./components/wrappers/AppWrapper";
import RouteGuard from "./components/guards/RouteGuard";
import { ROLES_RANKS } from "./utils/roles-rank";
import Sidebar from "./components/sidebar/Sidebar";
import Loader from "./components/loaders/Loader";
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
import ConfettiWrapper from "./components/wrappers/ConfettiWrapper";
import FeaturesList from "./features/dashboard/views/FeaturesList";
import {
  adminDashboardRoutes,
  studentDashboardRoutes,
} from "./features/dashboard/routes";

const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
        <RouteGuard
          allowedRanks={[ROLES_RANKS.SUPER_ADMIN, ROLES_RANKS.ADMIN]}
        />
      </AppWrapper>
    ),
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      ...adminDashboardRoutes, // /admin/dashboard/*
      ...adminParcoursRoutes, // /admin/parcours/*
      ...adminModulePreviewRoutes, // /admin/parcours/module/:moduleId
      ...adminGroupRoutes, // /admin/group/*
      ...adminModuleRoutes, // /admin/module/*
      ...adminCourseRoutes, // /admin/cours/*
      ...adminLessonRoutes, // /admin/lecons/*
      ...adminTagsRoutes, // /admin/tags
      ...adminRoleRoutes, // /admin/roles
      ...adminUserRoutes, // /admin/user
      ...adminFormationRoutes, // /admin/formation
      ...adminFeedbacksRoutes, // /admin/feedbacks
      ...adminDashboardIARoutes, // /admin/dashboard-ia
      ...adminMediathequeRoutes, // /admin/mediatheque
      ...adminResourcesRoutes, // /admin/resources
      ...adminProfileRoutes, // /admin/profil
      { path: "*", element: <p>La page n'existe pas</p> },
    ],
  },
];

const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      <ConfettiWrapper>
        <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
          <RouteGuard allowedRanks={[ROLES_RANKS.STUDENT]} />
        </AppWrapper>
      </ConfettiWrapper>
    ),
    children: [
      { index: true, element: <Navigate to="./dashboard" replace /> },
      ...studentDashboardRoutes, // /student/dashboard/*
      ...studentParcoursRoutes, // /student/parcours/*
      ...studentModulePreviewRoutes, // /student/parcours/module/:moduleId
      ...studentResourcesRoutes, // /student/ressources/*
      ...studentCalendarRoutes, // /student/calendrier
      ...studentProfileRoutes, // /student/profil

      // Fallback 404 spécifique à l'espace étudiant
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
