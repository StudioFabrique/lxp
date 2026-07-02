import { lazy, Suspense } from "react";
import Loader from "../../components/loaders/Loader";
import { RouteObject } from "react-router";
import AuthLayout from "./components/AuthLayout";
import LoginRightColumn from "./components/LoginRightColumn";
import LoginGuard from "./components/LoginGuard";

const Login = lazy(() => import("./views/Login"));
const RegisterHome = lazy(() => import("./views/Register"));
const ResetPasswordHome = lazy(() => import("./views/ResetPassword"));
const ResetPasswordUpdate = lazy(() => import("./views/ResetPasswordUpdate"));

// à déplacer dans un util réutilisable
const withSuspense = (Component: React.ElementType) => (
  <Suspense fallback={<Loader />}>
    <AuthLayout loginRighColumn={<LoginRightColumn />}>
      <Component />
    </AuthLayout>
  </Suspense>
);

export const authRoutes: RouteObject[] = [
  {
    element: <LoginGuard />,
    children: [
      { path: "/login", element: withSuspense(Login) },
      { path: "/register", element: withSuspense(RegisterHome) },
      { path: "/reset-password", element: withSuspense(ResetPasswordHome) },
      { path: "/reset-update", element: withSuspense(ResetPasswordUpdate) },
    ],
  },
];
