import { Suspense } from "react";
import { Outlet, RouteObject } from "react-router";

// UI Générique

import StudentGuard from "./components/StudentGuard";

import { parcoursStudentRoutes } from "@/features/parcours/routes";
import { resourcesStudentRoutes } from "@/features/resources/routes";
import { calendarStudentRoutes } from "@/features/calendar/routes";
import { profileStudentRoutes } from "@/features/profile/routes";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import Loader from "../../components/loaders/Loader";
import StudentDashboard from "./views/StudentDashboard";
import FeaturesList from "./views/FeaturesList";

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      <StudentGuard requiredRole="student">
        <DashboardLayout loader={<Loader />}>
          <Suspense fallback={<Loader />}>
            {/* L'Outlet rend les pages enfants */}
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </StudentGuard>
    ),
    children: [
      // Le tableau de bord par défaut (/student)
      { index: true, element: <StudentDashboard /> },

      // L'intégration des sous-modules métiers de l'étudiant
      parcoursStudentRoutes, // /student/parcours/*
      resourcesStudentRoutes, // /student/ressources/*
      calendarStudentRoutes, // /student/calendrier/*
      profileStudentRoutes, // /student/profil/*

      // Fallback 404 spécifique à l'espace étudiant
      { path: "*", element: <FeaturesList /> },
    ],
  },
];
