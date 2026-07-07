import { lazy } from "react";
import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/router-helpers";

const RoleList = lazy(() => import("./views/RoleList"));
const RoleEdit = lazy(() => import("./views/RoleEdit"));

export const adminRoleRoutes: RouteObject[] = [
  {
    path: "roles",
    children: [
      { index: true, element: withSuspense(RoleList) },
      { path: "edit/:id", element: withSuspense(RoleEdit) },
    ],
  },
];
