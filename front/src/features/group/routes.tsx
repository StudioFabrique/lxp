import { RouteObject } from "react-router";
import { withSuspense } from "../../utils/helpers/router-helpers";
import { lazy } from "react";
import { Outlet } from "react-router";

export const adminGroupRoutes: RouteObject[] = [
  {
    path: "group",
    element: (
      <div className="w-full flex flex-col gap-6">
        <Outlet />
      </div>
    ),
    children: [
      {
        index: true,
        element: withSuspense(lazy(() => import("./views/GroupList"))),
      },
      {
        path: "add",
        element: withSuspense(lazy(() => import("./views/GroupEdit"))),
      },
      {
        path: "edit/:id",
        element: withSuspense(lazy(() => import("./views/GroupEdit"))),
      },
    ],
  },
];
