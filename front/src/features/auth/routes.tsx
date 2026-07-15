import { lazy } from "react";
import { RouteObject } from "react-router";
import AuthLayout from "./components/AuthLayout";
import { withSuspense } from "../../utils/helpers/router-helpers";
import LoginGuard from "../../components/guards/LoginGuard";

const Init = lazy(() => import("./views/AppInit"));
const Login = lazy(() => import("./views/Login"));
const RegisterHome = lazy(() => import("./views/Register"));
const ResetPasswordHome = lazy(() => import("./views/ResetPassword"));
const ResetPasswordUpdate = lazy(() => import("./views/ResetPasswordUpdate"));

export const authRoutes: RouteObject[] = [
  {
    element: (
      <AuthLayout>
        <LoginGuard />
      </AuthLayout>
    ),
    children: [
      {path: "/init", element: withSuspense(Init)},
      { path: "/login", element: withSuspense(Login) },
      { path: "/register", element: withSuspense(RegisterHome) },
      { path: "/reset-password", element: withSuspense(ResetPasswordHome) },
      { path: "/reset-update", element: withSuspense(ResetPasswordUpdate) },
    ],
  },
];
