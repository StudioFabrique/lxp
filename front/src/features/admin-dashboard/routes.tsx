// src/features/admin-dashboard/routes.tsx
import { RouteObject } from "react-router";
import DashboardLayout from "../../components/layout/DashboardLayout.tsx";
import { RoleGuard } from "../../utils/router-helpers.tsx";

import { adminParcoursRoutes } from "../parcours/routes";
import Loader from "../../components/loaders/Loader.tsx";
import Sidebar from "../../components/sidebar/Sidebar.tsx";

// const AdminDashboard = lazy(() => import("./view/AdminDashboard"));

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <DashboardLayout sidebar={<Sidebar />} loader={<Loader />}>
        <RoleGuard allowedRanks={[1, 2]} />
      </DashboardLayout>
    ),
    children: [
      { index: true, element: <p>Dashboard Admin</p> },
      // { index: true, element: withSuspense(AdminDashboard) },
      ...adminParcoursRoutes,
      // ...adminCourseRoutes,
      // ...adminUserRoutes,
      { path: "*", element: <p>La page n'existe pas</p> },
    ],
  },
];
