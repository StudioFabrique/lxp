import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "./old-arch/views/home/root-layout.component";
import { Suspense, lazy } from "react";
import studentRoutes from "./old-arch/lib/routes/students-routes";
import adminRoutes from "./old-arch/lib/routes/admin-routes";
import Loader from "./old-arch/components/UI/loader";
import Login from "./old-arch/views/login/login";
import ContextProvider from "./old-arch/store/contextProvider.store";
import AppLayout from "./old-arch/components/UI/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuration optionnelle globale pour ton LXP
      refetchOnWindowFocus: false, // Évite de re-télécharger les données à chaque fois que tu changes d'onglet
      retry: 1, // Si une requête échoue, TanStack la retente 1 seule fois avant d'afficher l'erreur
    },
  },
});

const StudentLayout = lazy(
  () => import("./old-arch/views/student/student-layout.component"),
);
const AdminLayout = lazy(
  () => import("./old-arch/views/admin/admin-layout.component"),
);
const RegisterHome = lazy(
  () => import("./old-arch/views/register/register-home"),
);
const ResetPasswordHome = lazy(
  () => import("./old-arch/views/reset-password/reset-password-home"),
);
const ResetPasswordUpdate = lazy(
  () => import("./old-arch/views/reset-password/reset-password-update"),
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // espace apprenant
      {
        path: "student",
        element: (
          <AppLayout>
            <StudentLayout />
          </AppLayout>
        ),
        children: studentRoutes,
      },
      // espace admin - formateur
      {
        path: "admin",
        element: (
          <AppLayout>
            <AdminLayout />
          </AppLayout>
        ),
        children: adminRoutes,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loader />}>
        <RegisterHome />
      </Suspense>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <Suspense fallback={<Loader />}>
        <ResetPasswordHome />
      </Suspense>
    ),
  },
  {
    path: "/reset-update",
    element: (
      <Suspense fallback={<Loader />}>
        <ResetPasswordUpdate />
      </Suspense>
    ),
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
}

export default App;
