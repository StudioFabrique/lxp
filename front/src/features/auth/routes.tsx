import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";

export const authRoutes: RouteObject[] = [
  {
    element: withSuspense(lazy(() => import("./components/AuthLayout"))),
    children: [
      {
        path: "/init",
        element: withSuspense(lazy(() => import("./views/AdminInit"))),
      },
      {
        path: "/login",
        element: withSuspense(lazy(() => import("./views/Login"))),
      },
      {
        path: "/register",
        element: withSuspense(lazy(() => import("./views/Register"))),
      },
      {
        path: "/reset-password",
        element: withSuspense(lazy(() => import("./views/ResetPassword"))),
      },
      {
        path: "/reset-update",
        element: withSuspense(
          lazy(() => import("./views/ResetPasswordUpdate")),
        ),
      },
    ],
  },
];
