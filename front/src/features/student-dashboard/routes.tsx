import { RouteObject } from "react-router";

import Loader from "../../components/loaders/Loader";
import FeaturesList from "./views/FeaturesList";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { studentParcoursRoutes } from "../parcours/routes";
import Sidebar from "../../components/sidebar/Sidebar";
import ConfettiLayout from "./components/ConfettiLayout";
import { ROLES_RANKS } from "../../utils/roles-rank";
import RouteGuard from "../../components/guards/RouteGuard";

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      <ConfettiLayout>
        <DashboardLayout sidebar={<Sidebar />} loader={<Loader />}>
          <RouteGuard allowedRanks={[ROLES_RANKS.STUDENT]} />
        </DashboardLayout>
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
