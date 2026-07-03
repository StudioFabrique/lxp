import { lazy } from "react";
import { RouteObject } from "react-router";
import AuthLayout from "./components/AuthLayout";
import LoginRightColumn from "./components/LoginRightColumn";
import LoginGuard, { withSuspense } from "../../utils/router-helpers";

const Login = lazy(() => import("./views/Login"));
const RegisterHome = lazy(() => import("./views/Register"));
const ResetPasswordHome = lazy(() => import("./views/ResetPassword"));
const ResetPasswordUpdate = lazy(() => import("./views/ResetPasswordUpdate"));

export const authRoutes: RouteObject[] = [
  {
    element: (
      <AuthLayout loginRighColumn={<LoginRightColumn />}>
        <LoginGuard />
      </AuthLayout>
    ),
    children: [
      { path: "/login", element: withSuspense(Login) },
      { path: "/register", element: withSuspense(RegisterHome) },
      { path: "/reset-password", element: withSuspense(ResetPasswordHome) },
      { path: "/reset-update", element: withSuspense(ResetPasswordUpdate) },
    ],
  },
];
