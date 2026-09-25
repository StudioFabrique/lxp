import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";

export const authRoutes: RouteObject[] = [
  {
    lazy: lazyRoute(() => import("./components/AuthLayout")),
    HydrateFallback: () => null,
    children: [
      {
        path: "/init",
        lazy: lazyRoute(() => import("./views/AdminInit")),
      },
      {
        path: "/createRoot",
        lazy: lazyRoute(() => import("./views/CreateRoot")),
      },
      {
        path: "/confirm-email",
        lazy: lazyRoute(() => import("./views/ConfirmEmail")),
      },
      {
        path: "/login",
        lazy: lazyRoute(() => import("./views/Login")),
      },
      {
        path: "/instance-setup",
        lazy: lazyRoute(() => import("./views/InstanceSetup")),
      },
      {
        path: "/student/onboarding",
        lazy: lazyRoute(
          () => import("../learning-profile/views/StudentLearningOnboarding"),
        ),
      },
      {
        path: "/staff/onboarding",
        lazy: lazyRoute(() => import("./views/StaffOnboarding")),
      },
      {
        path: "/register",
        lazy: lazyRoute(() => import("./views/Register")),
      },
      {
        path: "/reset-password",
        lazy: lazyRoute(() => import("./views/ResetPassword")),
      },
      {
        path: "/reset-update",
        lazy: lazyRoute(() => import("./views/ResetPasswordUpdate")),
      },
    ],
  },
];
