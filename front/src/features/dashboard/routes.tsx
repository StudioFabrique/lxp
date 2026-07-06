// src/features/admin-dashboard/routes.tsx
import { RouteObject } from "react-router";
import DashboardWrapper from "../../components/wrappers/DashboardWrapper.tsx";

import {
  adminParcoursRoutes,
  studentParcoursRoutes,
} from "../parcours/routes.tsx";
import Loader from "../../components/loaders/Loader.tsx";
import Sidebar from "../../components/sidebar/Sidebar.tsx";
import { ROLES_RANKS } from "../../utils/roles-rank.ts";
import RouteGuard from "../../components/guards/RouteGuard.tsx";
import { adminGroupRoutes } from "../group/routes.tsx";
import ConfettiLayout from "./components/ConfettiLayout.tsx";
import FeaturesList from "./view/FeaturesList.tsx";

// const AdminDashboard = lazy(() => import("./view/AdminDashboard"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <DashboardWrapper sidebar={<Sidebar />} loader={<Loader />}>
        <RouteGuard
          allowedRanks={[ROLES_RANKS.SUPER_ADMIN, ROLES_RANKS.ADMIN]}
        />
      </DashboardWrapper>
    ),
    children: [
      { index: true, element: <p>Dashboard Admin</p> },
      // { index: true, element: withSuspense(AdminDashboard) },
      ...adminParcoursRoutes,
      ...adminGroupRoutes,
      // ...adminCourseRoutes,
      // ...adminUserRoutes,
      { path: "*", element: <p>La page n'existe pas</p> },
    ],
  },
];

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      <ConfettiLayout>
        <DashboardWrapper sidebar={<Sidebar />} loader={<Loader />}>
          <RouteGuard allowedRanks={[ROLES_RANKS.STUDENT]} />
        </DashboardWrapper>
      </ConfettiLayout>
    ),
    children: [
      { index: true, element: <p>Dashboard Étudiant</p> },
      // Le tableau de bord par défaut (/student)
      // { index: true, element: <StudentDashboard /> },

      // L'intégration des sous-modules métiers de l'étudiant
      ...studentParcoursRoutes, // /student/parcours/*

      // Fallback 404 spécifique à l'espace étudiant
      { path: "*", element: <FeaturesList /> },
    ],
  },
];
