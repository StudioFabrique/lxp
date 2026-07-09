import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";
import { lazy } from "react";
import { Outlet } from "react-router";

const GroupList = lazy(() => import("./views/GroupList"));
const GroupEdit = lazy(() => import("./views/GroupEdit"));

export const adminGroupRoutes: RouteObject[] = [
  {
    path: "group",
    element: (
      <div className="w-full flex flex-col gap-6">
        <Outlet />
      </div>
    ),
    children: [
      { index: true, element: withSuspense(GroupList) },
      { path: "add", element: withSuspense(GroupEdit) },
      { path: "edit/:id", element: withSuspense(GroupEdit) },
    ],
  },
];
