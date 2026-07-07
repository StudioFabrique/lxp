import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const UserHome = lazy(() => import("./views/UserHome"));
const UserAdd = lazy(() => import("./views/UserAdd"));
const UserEdit = lazy(() => import("./views/UserEdit"));

export const adminUserRoutes: RouteObject[] = [
  {
    path: "user",
    children: [
      { index: true, element: withSuspense(UserHome) },
      { path: "add", element: withSuspense(UserAdd) },
      { path: "edit/:id", element: withSuspense(UserEdit) },
    ],
  },
];
