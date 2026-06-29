import { createBrowserRouter, RouterProvider } from "react-router";

import RootLayout from "./views/home/root-layout.component";
import { Suspense, lazy } from "react";
import studentRoutes from "./lib/routes/students-routes";
import adminRoutes from "./lib/routes/admin-routes";
import Loader from "./components/UI/loader";
import Login from "./views/login/login";
import { ThemeProvider } from "./store/theme-context";
import ContextProvider from "./store/contextProvider.store";
import AppLayout from "./components/UI/AppLayout";

const StudentLayout = lazy(
  () => import("./views/student/student-layout.component"),
);
const AdminLayout = lazy(() => import("./views/admin/admin-layout.component"));
const RegisterHome = lazy(() => import("./views/register/register-home"));
const ResetPasswordHome = lazy(
  () => import("./views/reset-password/reset-password-home"),
);
const ResetPasswordUpdate = lazy(
  () => import("./views/reset-password/reset-password-update"),
);

const router = createBrowserRouter(
  [
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
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

function App() {
  return (
    <ContextProvider>
      <RouterProvider router={router} />
    </ContextProvider>
  );
}

export default App;
