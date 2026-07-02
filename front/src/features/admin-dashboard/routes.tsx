import { Suspense } from "react";

// Imports des SOUS-ROUTEURS depuis les autres features !
import { parcoursAdminRoutes } from "@/features/parcours/routes";
import { userAdminRoutes } from "@/features/users/routes";
import { courseAdminRoutes } from "@/features/courses/routes";
import { moduleAdminRoutes } from "@/features/modules/routes";
import { Outlet, RouteObject } from "react-router";
import Loader from "../../components/loaders/Loader";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import AdminDashboard from "./view/AdminDashboard";

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      // Le Guard (vérification du rôle) + Le Shell visuel
      <DashboardLayout loader={<Loader />}>
        <Suspense fallback={<Loader />}>
          {/* C'est ici que les enfants seront rendus */}
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <AdminDashboard /> }, // Le dashboard principal admin

      // On branche les modules métiers ici, proprement :
      parcoursAdminRoutes,
      userAdminRoutes,
      courseAdminRoutes,
      moduleAdminRoutes,

      // Vous ferez la même chose pour lesson, teacher, feedbacks...
    ],
  },
];
