import { RouteObject } from "react-router";

import Loader from "../../components/loaders/Loader";
import FeaturesList from "./views/FeaturesList";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { RoleGuard } from "../../utils/router-helpers";
import { studentParcoursRoutes } from "../parcours/routes";
import Sidebar from "../../components/sidebar/Sidebar";

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      <DashboardLayout sidebar={<Sidebar />} loader={<Loader />}>
        <RoleGuard allowedRanks={[3]} />
      </DashboardLayout>
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
