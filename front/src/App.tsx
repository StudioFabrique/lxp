import { RouterProvider, createBrowserRouter } from "react-router-dom";

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
  async () => await import("./views/student/student-layout.component"),
);

const AdminLayout = lazy(
  async () => await import("./views/admin/admin-layout.component"),
);

const RegisterHome = lazy(
  async () => await import("./views/register/register-home"),
);

const ResetPasswordHome = lazy(
  async () => await import("./views/reset-password/reset-password-home"),
);

const ResetPasswordUpdate = lazy(
  async () => await import("./views/reset-password/reset-password-update"),
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
    <ContextProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ContextProvider>
  );
}

export default App;
