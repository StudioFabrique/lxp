import { RouterProvider, createBrowserRouter } from "react-router-dom";

import RootLayout from "./views/home/root-layout.component";
import { Suspense, lazy } from "react";
import studentRoutes from "./lib/routes/students-routes";
import adminRoutes from "./lib/routes/admin-routes";
import Loader from "./components/UI/loader";
import Sidebar from "./components/UI/sidebar/sidebar";
import Login from "./components/login/login.component";
import { ThemeProvider } from "./store/theme-context";
import ContextProvider from "./store/contextProvider.store";
import { COMPANY_LOGO } from "./config/urls";

const StudentLayout = lazy(
  async () => await import("./views/student/student-layout.component")
);

const AdminLayout = lazy(
  async () => await import("./views/admin/admin-layout.component")
);

const RegisterHome = lazy(
  async () => await import("./views/register/register-home")
);

const ResetPasswordHome = lazy(
  async () => await import("./views/reset-password/reset-password-home")
);

const ResetPasswordUpdate = lazy(
  async () => await import("./views/reset-password/reset-password-update")
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
          <div className="flex flex-col gap-2">
            <img
              className="self-start max-h-20 object-contain rounded-lg border-slate-700 border-1 p-0.5"
              src={COMPANY_LOGO}
            />
            <div className="flex gap-2">
              <Sidebar />

              <Suspense fallback={<Loader />}>
                <StudentLayout />
              </Suspense>
            </div>
          </div>
        ),
        children: studentRoutes,
      },
      // espace admin - formateur
      {
        path: "admin",
        element: (
          <>
            <Sidebar />

            <Suspense fallback={<Loader />}>
              <AdminLayout />
            </Suspense>
          </>
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
