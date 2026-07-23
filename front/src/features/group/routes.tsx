import { RouteObject } from "react-router";
import { lazyRoute } from "../../utils/helpers/router-helpers";
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
        lazy: lazyRoute(() => import("./views/GroupList")),
      },
      {
        path: "add",
        lazy: lazyRoute(() => import("./views/GroupEdit")),
      },
      {
        path: "edit/:id",
        lazy: lazyRoute(() => import("./views/GroupEdit")),
      },
    ],
  },
];
